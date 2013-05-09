/**
 * Provides the Y.TaskList class
 * @module task-list
 */
YUI.add('task-list', function(Y) {
	
	var YArray				=	Y.Array,
		YObject				=	Y.Object,
		DEFAULT_WORK		=	8;

	/**
	* Represents project task list. Provides facilities for Indent, Outdent and Schedule Calculations.
	* @class TaskList
	* @extends TreeModelList
	*/
	Y.TaskList = Y.Base.create('taskList', Y.TreeModelList, [Y.ModelListVariance], {
		initializer: function(){
			this.model = Y.Task;
			this.after('task:change', this._taskChangeInterceptor);
		},

		/**
		Need to override indent method for schedule calculation. Whenever a task is indented following should be taken care of:
		
		1. After indentation a task will get a new parent. The task and the parent both can not have the other as their dependency.
			So the predecessors should be updated
		2. If the identified parent of the task being indented, is not already a parent then:
		
			1. Make it's effort zero and add the child task effort to it.
			2. If the new parent, doesn't have any dependencies then it's start date is set to it's parent's start date.
				The child (task being indented) gets it's start date as it's new parent's start date, provided child doesn't have any dependencies.
			3. If identified parent had some resource allocated, then it's freed (as it is a summary task and summary tasks don't have a resource).
				Adjust schedule due to resource free.
			4. Child (task being indented) end date is calculated and same is set to parent's end date

		3. If the identified parent is already a summary task and child doesn't have any depencies
			then child's start date is set to parent's start date.
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

				//TODO: Implement point 1 in comments to udpate the dependency graph
				//Since we already call indent it means identifiedParent will have at least one child. So if it has exactly one child then
				//it means the parent is created because of current indentation.
				if (identifiedParent.get('children').size() === 1) {

					//Since the identified parent is becoming a summary task, it's effort becomes zero,
					//which means all it's ancestors effort needs to be reduced
					self._updateAncestorsWork(identifiedParent, 0-identifiedParentWork);
					identifiedParentWork = 0;
				}

				identifiedParentWork = identifiedParentWork + child.get('work');
				identifiedParent.set('work', identifiedParentWork, {silent: true});
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
		3. If outdented task doesn't have any dependencies
			then it's new parent's start date becomes it's own start date and end date needs a recalculation.
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
				} else {
					var oldParentWork = oldParent.get('work');
					oldParentWork = oldParentWork - taskWork;
					oldParent.set('work', oldParentWork, {silent: true});
				}
			}
		},

		/**
		Overrides Y.TreeModelList/_addInterceptor method to add scheduling specific logic.
		
		Since we are enforcing each project to have only one root task, we need to override this method.
		This method does some checks as well to ensure that project gets only one root task:

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
					message: 'You are trying to insert a task before first task, ' +
								'which represents the entire project. A task can not be inserted before project task.'
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

				if (parent.get('children').size() === 0 /*see if parent of removed task is still a parent or not*/
					&& parentId !== 'task_0' /*see if we are not at the very first task*/){
					workAdjustment = workAdjustment + DEFAULT_WORK;
					pwork = DEFAULT_WORK;

					parent.set('work', pwork, {silent: true});
				}

				this._updateAncestorsWork(parent, workAdjustment);
			}

			Y.ProjectDependencyGraph.deleteNode(clientId);
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
				this._handlePredecessorsChange(task, e.changed.predecessors.newVal, e.changed.predecessors.prevVal);
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

		_handlePredecessorsChange: function(task, newVal, prevVal){
			var list = this,
				taskId = task.get('clientId');

			if (prevVal){
				YObject.each(prevVal.FS, function(val, key){
					Y.ProjectDependencyGraph.removeOutgoingTransition(key, taskId);
				});
			}

			if (newVal){
				YObject.each(newVal.FS, function(val, key){
					Y.ProjectDependencyGraph.addOutgoingTransition(key, taskId, 'ED_SD');
				});
			}

			Y.log(prevVal);
			Y.log(newVal);
		},

		_handleWorkChange: function(task, newWork, oldWork){
			var workDiff = newWork - oldWork,
				list = this;

			list._updateAncestorsWork(task, workDiff);
		},

		_handleStartDateChange: function(task, newStartDate, oldStartDate){
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
		}
	});
});
