/**
 * Provides the Y.ProjectDependencyGraph class
 * @module project-dependency-graph
 * @class ProjectDependencyGraph
 **/
YUI.add('project-dependency-graph', function(Y){
	
	var ProjectDependencyGraph,
		YObject = Y.Object,
		YDate = Y.DataType.Date;
	
	ProjectDependencyGraph = function(){
	};
	
	ProjectDependencyGraph.prototype = {
		addOutgoingTransition: function(from, to, type){
			var self = this,
				dependencyGraph = self.dependencyGraph,
				transitions = dependencyGraph.transitions,
				incoming = transitions.incoming,
				outgoing = transitions.outgoing,
				set;
				
			//Set the outgoing transition. Each node can have multiple transitions
			set = outgoing[from] || {};
			set[to] = {type: type};
			outgoing[from] = set;
			
			//Set corresponding incoming transition.
			set = incoming[to] || {};
			set[from] = {type: type};
			incoming[to] = set;
		},
		
		removeOutgoingTransition: function(from, to){
			var self = this,
				dependencyGraph = self.dependencyGraph,
				transitions = dependencyGraph.transitions,
				incoming = transitions.incoming,
				outgoing = transitions.outgoing,
				set;
			
			//Remove outgoing transition
			set = outgoing[from];
			delete set[to];
			YObject.isEmpty(set) && delete outgoing[from];
			
			//Remove corresponding incoming transtion
			set = incoming[to];
			delete set[from];
			YObject.isEmpty(set) && delete incoming[to];
		},
		
		deleteNode: function(node){
			var self = this,
				dependencyGraph = self.dependencyGraph,
				transitions = dependencyGraph.transitions,
				incoming = transitions.incoming,
				outgoing = transitions.outgoing,
				set;
				
			set = outgoing[node];
			YObject.each(set, function(val, key, obj){
				delete incoming[key][node];
				YObject.isEmpty(incoming[key]) && delete incoming[key];
			});
			set && delete outgoing[node];
			
			set = incoming[node];
			YObject.each(set, function(val, key, obj){
				delete outgoing[key][node];
				YObject.isEmpty(outgoing[key]) && delete outgoing[key];
			});
			set && delete incoming[node];
		},
		
		/**
		This is basically breadth first search algorithm.
		@param {Object} list
		*/
		calculateSchedule: function(list){
			
			this.resetGraph();
			
			var startTime = new Date(),
				self = this,
				dependencyGraph = self.dependencyGraph,
				transitions = dependencyGraph.transitions,
				incoming = transitions.incoming,
				outgoing = transitions.outgoing,
				queue = new Y.Queue(),
				currentNode,
				outTrans,
				inTrans,
				sendSuccessorStartDate,
				rootStartDate = list.getByClientId('task_0').get('startDate'),
				startDate,
				endDate,
				task,
				isSummaryTask;
			
			queue.add('task_0');
			
			while(queue.size() > 0){
				Y.log('[' + queue._q + ']');
				currentNode = queue.next();			//Get taskId from queue
				task = list.getByClientId(currentNode); //Get task model from list
				isSummaryTask = task.get('children').size();
				startDate = rootStartDate;			//Reset startDate
				endDate = rootStartDate;			//Reset endDate
				sendDependentEndDate = true;
				sendSuccessorStartDate = true;			//Reset inboundEndDate flag
				inTrans = incoming[currentNode];	//Incoming transitions to current task
				
				YObject.each(inTrans, function(val, key, obj){
					if (!inTrans.successorStartDateSent && sendSuccessorStartDate &&
							(val.type === 'SD_SD' || val.type === 'ED_SD' || val.type === 'RES_ED_SD')) {
						if (val.done){
							if (YDate.isGreater(val.value, startDate)){
								startDate =  val.value;
								obj.winner = val;
							}
						} else {
							sendSuccessorStartDate = false;
						}
					}
					
					if (val.type === 'ED_ED'){
						if (val.done){
							if (YDate.isGreater(val.value, endDate)){
								endDate = val.value;
							}
						} else {
							sendDependentEndDate = false;
						}
					}
				});
				
				if (sendDependentEndDate && !inTrans.dependentEndDateSent && isSummaryTask){
					task.set('endDate', endDate, {silent: true});
					inTrans.dependentEndDateSent = true;
				}
				
				if (sendSuccessorStartDate && !inTrans.successorStartDateSent){
					inTrans.successorStartDateSent = true;
					task.set('startDate', startDate, {silent: true});
					if (!isSummaryTask){
						endDate = Y.ProjectCalendar.calcTaskEndDateWithResourceFromScratch(list.getByClientId(currentNode));
					}
				}
				
				outTrans = outgoing[currentNode];
				YObject.each(outTrans, function(val, key, obj){
					obj = incoming[key][currentNode];
					if (!obj.done) {
						if (obj.type === 'SD_SD' && sendSuccessorStartDate){
							obj.done = true;
							obj.value = startDate;
							queue.demotePush(key);
						}
						
						if ((obj.type === 'ED_SD' || obj.type === 'RES_ED_SD' || obj.type === 'ED_ED')
								&& sendSuccessorStartDate && sendDependentEndDate){
							obj.done = true;
							obj.value = endDate;
							queue.demotePush(key);
						}
					}
				});
			}
			var endTime = new Date();
			Y.log(endTime.getTime() - startTime.getTime());
			Y.log(transitions);
		},
	
		resetGraph: function(){
			var self = this,
				dependencyGraph = self.dependencyGraph,
				transitions = dependencyGraph.transitions,
				incoming = transitions.incoming;
				
			YObject.each(incoming, function(val, key){
				delete val.dependentEndDateSent;
				delete val.successorStartDateSent;
				
				YObject.each(val, function(v,k){
					delete v.value;
					delete v.done;
				});
				
			});
		},
		
		/**
		@method processTaskForSchedule
		@param {String} currentTaskId	Task id of task being processed
		@param {Y.Task} currentTask	Task object being processed
		@param {Object} transition	Object containing incoming and outcoming dependencies for tasks in project
		@param {Y.Queue} queue	Queue to put taskid for which incoming transitions are done while processing. This queue object
			is augmented by  {{#crossLink "queue-demote"}}{{/crossLink}} module
		**/
		processTaskForSchedule: function(currentTaskId, currentTask, transition, projectCalendar, queue) {
			var isSummaryTask = currentTask.getChildCount(),
				isStartDateAvailable = true,
				currentTaskIncoming = transition.incoming[currentTaskId],
				startDate,
				endDate;
			
			YObject.each(currentTaskIncoming, function(val, key, obj){
				if (!obj.startDateKnown){
					if (val.done && (val.type === 'SD_SD' || val.type === 'ED_SD')){
						if (!startDate || YDate.isGreater(val.value, startDate)){
							startDate = val.value;
						}
					} else if ((val.type === 'SD_SD' || val.type === 'ED_SD') && !val.done){
						isStartDateAvailable = false;
					}
				}
			});
			
			if (isStartDateAvailable && !currentTaskIncoming.startDateKnown){
				currentTaskIncoming.startDateKnown = true;
				currentTask.set('startDate', startDate);
				if (!isSummaryTask){
					endDate = projectCalendar.calcTaskEndDateWithResourceFromScratch(currentTask);
					currentTask.set('endDate', endDate);
				}
			}
		}
	};
	
	Y.ProjectDependencyGraph = new ProjectDependencyGraph();
});