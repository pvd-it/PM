/**
 * Provides the Y.TaskList class
 * @module project-dependency-graph
 */
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
			var startTime = new Date();
			var self = this,
				dependencyGraph = self.dependencyGraph,
				transitions = dependencyGraph.transitions,
				incoming = transitions.incoming,
				outgoing = transitions.outgoing,
				queue = [],
				currentNode,
				outTrans,
				inTrans,
				sendSuccessorStartDate,
				sendParentEndDate,
				rootStartDate = list.getByClientId('task_0').get('startDate'),
				startDate,
				endDate,
				inWinner,
				task,
				isSummaryTask;
			
			queue.push('task_0');
			
			while(queue.length > 0){
				Y.log(queue);
				currentNode = queue.shift();			//Get taskId from queue
				task = list.getByClientId(currentNode); //Get task model from list
				isSummaryTask = task.get('children').size();
				
				startDate = rootStartDate;			//Reset startDate
				endDate = rootStartDate;			//Reset endDate
				sendDependentEndDate = true;
				sendSuccessorStartDate = true;			//Reset inboundEndDate flag 
				inTrans = incoming[currentNode];	//Incoming transitions to current task
				
				YObject.each(inTrans, function(val, key, obj){
					if (!inTrans.successorStartDateSent && sendSuccessorStartDate && (val.type === 'SD_SD' || val.type === 'ED_SD' || val.type === 'RES_ED_SD')) {
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
							queue.push(key);
						}
						
						if ((obj.type === 'ED_SD' || obj.type === 'RES_ED_SD' || obj.type === 'ED_ED') && sendSuccessorStartDate && sendDependentEndDate){
							obj.done = true;
							obj.value = endDate;
							queue.push(key);
						}						
					}
				});
			}
		
			self.resetGraph();
			
			var endTime = new Date();
			Y.log(endTime.getTime() - startTime.getTime());
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
		}
	};
	
	Y.ProjectDependencyGraph = new ProjectDependencyGraph();
});