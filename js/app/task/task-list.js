/**
 * Provides the Y.TaskList class
 * @module task-list
 */
YUI.add('task-list', function(Y) {
	
	var YLang 				= 	Y.Lang,
		YArray 				= 	Y.Array,
		YObject 			= 	Y.Object,
		YDate 				= 	Y.DataType.Date,
		DEFAULT_WORK		=	8;
	
	/**
	 * Represents project task list. Provides facilities for Indent, Outdent and Schedule Calculations.
	 * @class Y.TaskList
	 * @extends Y.TreeModelList
	 */
	Y.TaskList = Y.Base.create('taskList', Y.TreeModelList, [Y.ModelListVariance], {
		initializer: function(){
			this.model = Y.Task;
			this.after('task:change', this._taskChangeInterceptor);
		},
		
		/**
		 Need to override indent method for schedule calculation. Whenever a task is indented following should be taken care of:
		 
		 1. After indentation a task will get a new parent. The task and the parent both can not have the other as their dependency. So the predecessors should be updated
		 2. If the identified parent of the task being indented, is not already a parent then:
		 
		    1. Make it's effort zero and add the child task effort to it.
		    2. If the new parent, doesn't have any dependencies then it's start date is set to it's parent's start date. 
		       The child (task being indented) gets it's start date as it's new parent's start date, provided child doesn't have any dependencies.
		    3. If identified parent had some resource allocated, then it's freed (as it is a summary task and summary tasks don't have a resource). Adjust schedule due to resource free.
		    4. Child (task being indented) end date is calculated and same is set to parent's end date
		 
		 3. If the identified parent is already a summary task and child doesn't have any depencies then child's start date is set to parent's start date.
		    Child's end date is calculated and parent's end date is updated if it's less than child's end date.
		 @method indent
		 @param {Y.Task} task Task to indent  
		 */
		indent: function(child){
			var self = this,
				identifiedParent = Y.TreeModelList.prototype.indent.apply(self, arguments);
				
			//Check if indent actually happened. TreeModelList.prototype.indent method returns identifed parent if indent was done.
			if(identifiedParent){
				var identifiedParentWork = identifiedParent.get('work');

				//TODO: Implement point 1 in comments
				
				//Since we already call indent it means identifiedParent will have at least one child. So if it has exactly one child then
				//it means the parent is created because of current indentation.
				if (identifiedParent.get('children').size() === 1) {
	
					//Since the identified parent is becoming a summary task, it's effort becomes zero, which means all it's ancestors effort needs to be reduced
					self._updateAncestorsWork(identifiedParent, 0-identifiedParentWork);
					identifiedParentWork = 0;
	
					var grandParent = self.getByClientId(identifiedParent.get('parent')),
						parentPredecessors = identifiedParent.get('predecessors');
					
					//Since parent doesn't have predecessors then it's startDate would be start date of it's parent
					if (!parentPredecessors || parentPredecessors.length === 0){
						grandParent.set('startDate', grandParent.get('startDate'), {silent: true});
					}
					
					//Since endDate needs to be set by child end date, put a sentinel value, so that endDate check will work properly
					identifiedParent.set('endDate', new Date(0), {silent: true});
					
					//TODO: Check if parent start date needs to be recalculated, since it's predecessors might have changed in first TODO.
				}
				
				var childPredecessors =  child.get('predecessors');
				//Since child doesn't have predecessors then it's startDate would be same as parent's startDate
				if (!childPredecessors || childPredecessors.length === 0){
					child.set('startDate', identifiedParent.get('startDate'), {silent: true});
				}
				//TODO: Check if child start date needs to be recalculated, since it's predecessors might have changed in first TODO
				
				identifiedParentWork = identifiedParentWork + child.get('work');
				identifiedParent.set('work', identifiedParentWork, {silent: true});
				
				Y.ProjectCalendar.calcTaskEndDateWithResourceFromScratch(child, this);
			}
		},
		
		/**
		Overrides Y.TreeModelList/outdent method. The schedule calculations proceed only if Y.TreeModelList/outdent returns newParent
		for task being outdented.
		Outdenting a task may have following scenarios:
		
		1. After outdent, if outdentTask's old parent is no longer a summary task, then by default set the work of old parent to DEFAULT\_WORK = 8.
		and add DEFAULT\_WORK to work of ancestors.
		2. After outdent, if outdentTask's old parent is still a summary task, just reduce the work of old parent by outdentTask's work.
		Also update the endDate of the old parent.
		3. If outdented task doesn't have any dependencies then it's new parent's start date becomes it's own start date and end date needs a recalculation.
		4. If outdented task has some dependencies, then check if start date needs to be recalculated and accordingly perform a recalculation.
		
		@method outdent
		@param {Y.Task} task Task to outdent
		 */
		outdent: function(task){
			var self = this,
				oldParent = self.getByClientId(task.get('parent')),
				taskWork = task.get('work'),
				newParent;
				
			newParent = Y.TreeModelList.prototype.outdent.apply(self, arguments);
			
			if (newParent){
				//Handle impact of outdent on old parent task
				if (oldParent.get('children').size() === 0) {
					oldParent.set('work', DEFAULT_WORK, {silent: true});
					self._updateAncestorsWork(oldParent, DEFAULT_WORK);
					Y.ProjectCalendar.calcTaskEndDateWithResourceFromScratch(oldParent, this);
				} else {
					var oldParentWork = oldParent.get('work');
					oldParentWork = oldParentWork - taskWork;
					oldParent.set('work', oldParentWork, {silent: true});
					//TODO: Update endDate based on remaining children
				}
				
				//Check if outdented task depends on other task. If not then outdent task's start date would be same as start date of it's new parent
				var outdentPredecessors = task.get('predecessors');
				if (!outdentPredecessors || outdentPredecessors.length === 0) {
					var newParentStartDate = newParent.get('startDate');
					task.set('startDate', newParentStartDate, {silent: true});
					Y.ProjectCalendar.calcTaskEndDateWithResourceFromScratch(oldParent, this);
				}
				//TODO: See if predecessors change is happening, if yes then calculate new start date and reschedule
			}
		},
		
		/**
		 Overrides Y.TreeModelList/_addInterceptor method to add scheduling specific logic.
		 
		 Since we are enforcing each project to have only one root task, we need to override this method. This method does some checks as well to ensure
		 that project gets only one root task:
		 
		  1. Doesn't allow adding a task above the root task.
		  2. Find the candid Parent for the task being added, if it's null then assign the very first task as it's parent.
		 
		 @method _addInterceptor
		 @private
		 @param {Object} e Add event object
		 */
		_addInterceptor: function(e){
			if (e.index === 0 && this.size() > 0) {
				e.halt(); //prevent the default action
				Y.fire('alert', {
					type: 'info',
					message: 'You are trying to insert a task before first task, which represents the entire project. A task can not be inserted before project task.'
				});
				return;
			}
			
			// This is very first task added to project, so don't have to do anything special.
			var newClientId = e.model.get('clientId');
			if (newClientId === 'task_0'){
				return;
			}			
			
			var	parent = this._findCandidParent(e.model, e.index);

			//Very first task as default parent, since no candid Parent was found
			parent = parent ? parent : this.item(0);
			this._changeParent(e.model, parent);
			
			if (parent){
				var parentWork = parent.get('work'),
					childWork = e.model.get('work');
				
				//When a child task is added, paren't total work is added with task work and needs to be propagated to ancestors as well
				parentWork = parentWork + childWork;
				parent.set('work', parentWork, {silent: true});
				this._updateAncestorsWork(parent, childWork);
				
				//By default startDate of child, would be that of parent, unless modified because of predecessor or some constraints
				e.model.set('startDate', parent.get('startDate'), {silent: true});
				
				// Calculate task end date
				e.model.set('endDate', Y.ProjectCalendar.calcTaskEndDateWithResourceFromScratch(e.model, this), {silent: true});
				
				// See if task end date is greater than parent end date. If parent end date is not set, then set the task's end date
				if (!parent.get('endDate') || YDate.isGreater(e.model.get('endDate'), parent.get('endDate'))) {
					parent.set('endDate', e.model.get('endDate'), {silent: true});
				}
			}
		},
		
		_removeInterceptor: function(e){
			var clientId = e.model.get('clientId');
			if (clientId === 'task_0'){
				e.halt(); //prevent the default action
				Y.fire('alert', {
					type: 'info',
					message: 'You are trying to delete very first task, which represents the entire project. This task can not be deleted.'
				});
				return;
			}
			
			var parentId = e.model.get('parent');
			
			Y.TreeModelList.prototype._removeInterceptor.apply(this, arguments);
			
			if (parentId){
				var parent = this.getByClientId(parentId),
					pwork = parent.get('work'),
					workAdjustment = 0 - e.model.get('work'); //-ve of child work is adjustment for parent
				
				pwork = pwork + workAdjustment;
				parent.set('work', pwork, {silent: true});

				if (parent.get('children').size() === 0 /*see if parent of removed task is still a parent or not*/ && parentId !== 'task_0' /*see if we are not at the very first task*/){
					workAdjustment = workAdjustment + DEFAULT_WORK;
					pwork = DEFAULT_WORK;

					var parentOfParent = this.getByClientId(parent.get('parent'));
					
					//TODO: If parent does have predecessors then calculate start date accordingly otherwise parentOfParent's start date is fine
					parent.set('startDate', parentOfParent.get('startDate'), {silent: true});
					parent.set('work', pwork, {silent: true});
					parent.set('endDate', Y.ProjectCalendar.calcTaskEndDateWithResourceFromScratch(parent, this), {silent: true});
				}
				
				this._updateAncestorsWork(parent, workAdjustment);
			}
		},
		
		_taskChangeInterceptor: function(e){
			var task = e.target,
				list = this;
			
			Y.log('_taskChangeInterceptor');
			
			if (e.changed.resources){
				list._handleResourcesChange(e);
			}
			
			if (e.changed.startDate){
				this._handleStartDateChange(task, e.changed.startDate.newVal, e.changed.startDate.prevVal);
			}
			
			if (e.changed.work){
				this._handleWorkChange(task, e.changed.work.newVal, e.changed.work.prevVal);
			}
			
			if (e.changed.predecessors){
				//this._handlePredecessorsChange(e);
			}
			
		},
		
		_handleResourcesChange: function(e){
			var task = e.target,
				impactedTask = [],
				list = this;
				
			Y.log(e);
				
			YArray.each(e.resourcesAdded, function(addedRes){
				YArray.each(addedRes.get('assignedTasks'), function(taskId){
					impactedTask.push(list.getByClientId(taskId));
				});
			});
		},
		
		_handlePredecessorsChange: function(e){
			var list = this,
				oldPred = e.changed.predecessors.prevVal,
				newPred = e.changed.predecessors.newVal,
				task = e.target,
				selfId = task.get('clientId'),
				maxEndDate = new Date();
				emptyPredecessors = true;
				maxEndDate.setFullYear(1970);
				
			YObject.each(oldPred, function(typeVal, typeKey){
				YObject.each(typeVal, function(v, k){
					var predTask = list.getByClientId(v),
						predTaskSucc;
					
					if (predTask){
						predTaskSucc = predTask.get('successors');
						predTaskSucc && predTaskSucc[typeKey] && delete predTaskSucc[typeKey][selfId];	
					}
					
					
				});
			});
		
			YObject.each(newPred, function(typeVal, typeKey){
				YObject.each(typeVal, function(v, k){
					var predTask = list.getByClientId(v),
						predTaskSucc = predTask.get('successors'),
						predTaskEndDate;
						
					emptyPredecessors = false;
						
					predTaskEndDate = predTask.get('endDate');
					if(Y.DataType.Date.isGreater(predTaskEndDate, maxEndDate)){
						maxEndDate = predTaskEndDate;
					}
						
					predTaskSucc = predTaskSucc || {};
					predTaskSucc[typeKey] = predTaskSucc[typeKey] || {};
					predTaskSucc[typeKey][selfId] = selfId;
					
					predTask.set('successors', predTaskSucc, {silent: true});
				});
			});
			
			if (!emptyPredecessors){
				task.set('startDate', maxEndDate);
			} else {
				var parentId = task.get('parent'),
					parent,
					parentStartDate;
					
				if (parentId){
					parent = list.getByClientId(parentId);
					parentStartDate = parent.get('startDate');
					task.set('startDate', parentStartDate); 
				}
				
			}

		},
		
		_handleWorkChange: function(task, newWork, oldWork){
			var parentId = task.get('parent'),
				childCount = task.get('children').size(),
				workDiff = newWork - oldWork,
				list = this;
			
			//If task is a parent
			if (childCount > 0){
				
			} else {
			//task is a leaf level task
			//calculate endDate based on new work value
				var endDate = Y.ProjectCalendar.calcTaskEndDate(task.get('clientId'), task.get('startDate'), task.get('startDate'), oldWork, newWork);
				task.set('endDate', endDate);
			}
			
			//If task has parent
			if (parentId){
				var parent = list.getByClientId(parentId),
					parentWork = parent.get('work');
					
				parentWork = parentWork + workDiff;
				
				parent.set('work', parentWork);
			}
			
		},
		
		_handleStartDateChange: function(task, newStartDate, oldStartDate){
			var largestEndDate = newStartDate,
				list = this;
			
			if (task.get('children').size() > 0) {
				//The task is parent task
				task.get('children').each(function(childTaskId){
					var childTask = this.getByClientId(childTaskId),
						childPreds = childTask.get('predecessors'),
						hasPreds = false;
					
					YObject.each(childPreds, function(v, k){
						YObject.each(v, function(tid){
							hasPreds = true;
						});
					});
					
					if (!hasPreds){
						childTask.set('startDate', newStartDate);
					}
					
				}, this);
				
			} else {
				var endDate = Y.ProjectCalendar.calcTaskEndDate(task.get('clientId'), oldStartDate, newStartDate, task.get('work'), task.get('work'));
				task.set('endDate', endDate);
			}
		},
		
		_handlePredecessorEndDateChange: function(taskId){
			var list = this,
				task = list.getByClientId(taskId),
				pred = task.get('predecessors'),
				maxEndDate;
		
			YObject.each(pred, function(v, k){
				if (k === 'FS'){
					YObject.each(v, function(predId){
						var predTask = list.getByClientId(predId),
							predEndDate = predTask.get('endDate');
						
						if (!maxEndDate || Y.DataType.Date.isGreater(predEndDate, maxEndDate)){
							maxEndDate = predEndDate;
						}
					});
				}
			});
			
			task.set('startDate', maxEndDate);
		},
		
		_updateAncestorsWork: function(task, workAdjustment) {
			var self = this,
				parentTask = self.getByClientId(task.get('parent'));
				
			while (parentTask) {
				var parentWork = parentTask.get('work');
				parentWork = parentWork + workAdjustment;
				parentTask.set('work', parentWork, {silent: true});
				
				parentTask = self.getByClientId(parentTask.get('parent'));
			}
		},
	});
});
