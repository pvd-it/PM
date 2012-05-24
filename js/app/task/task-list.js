YUI.add('task-list', function(Y) {
	
	var EVT_PARENT_CHANGE = 'parentChange';
	
	Y.TaskList = Y.Base.create('taskList', Y.TreeModelList, [], {
		
		model: Y.Task,
		
		initializer: function(){
			this.on('task:change', this._taskChangeInterceptor);
			this.publish(EVT_PARENT_CHANGE,    {defaultFn: this._defAddFn});
		},
		
		_taskChangeInterceptor: function(e){
			
			var task = e.target,
				list = this;
			
			if (e.changed.startDate){
				this._handleStartDateChange(task, e.changed.startDate.newVal, e.changed.startDate.prevVal);
			}
			
			if (e.changed.work){
				this._handleWorkChange(task, e.changed.work.newVal, e.changed.work.prevVal);
			}
			
			if (e.changed.endDate){
				this._handleEndDateChange(e);
			}
			
			if (e.changed.parent){
				this._handleParentChange(e);
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
						oldStartDate = childTask.get('startDate'),
						newEndDate;
					
					childTask.set('startDate', newStartDate, {silent: true});
					this._handleStartDateChange(childTask, newStartDate, oldStartDate);
					newEndDate = childTask.get('endDate');
					
					if (Y.DataType.Date.isGreater(newEndDate, largestEndDate)){
						largestEndDate = newEndDate;
					}
				}, this);
				
				task.set('endDate', largestEndDate);
				
			} else {
				var endDate = Y.ProjectCalendar.calcTaskEndDate(task.get('clientId'), oldStartDate, newStartDate, task.get('work'), task.get('work'));
				task.set('endDate', endDate);
			}
		},
		
		_handleEndDateChange: function(e) {
			var endDate = e.changed.endDate.newVal,
				list = this,
				task = e.target,
				parentId = task.get('parent');
			
			//If the task for which endDate is changing has a parent then update the endDate of parent
			if (parentId){
				var parent,
					parentEndDate,
					child,
					childEndDate;

				parent = list.getByClientId(parentId);
				parentEndDate = parent.get('endDate');
				//If child's endDate is greater than parent's endDate, then make the child's endDate as parent's endDate
				if (Y.DataType.Date.isGreater(endDate, parentEndDate)){
					parent.set('endDate', endDate);
				} else {
				
				//If child's endDate is not greater than parent's endDate, then iterate through all children of parent to find out
				//greatest endDate
					parentEndDate = endDate;
					parent.get('children').each(function(childId){
						child = list.getByClientId(childId);
						childEndDate = child.get('endDate');
						if(Y.DataType.Date.isGreater(childEndDate, parentEndDate)){
							parentEndDate = childEndDate;
						}
					});
					parent.set('endDate', parentEndDate);
				}
			}
		},
		
		_handleParentChange: function(e){
			var task = e.target,
				oldParentId = e.changed.parent.prevVal,
				newParentId = e.changed.parent.newVal,
				list = this,
				taskWork = task.get('work');
				
			if (oldParentId){
				var oldParent = list.getByClientId(oldParentId),
					oldParentWork = oldParent.get('work');
				
				oldParentWork = oldParentWork - taskWork;
				oldParent.set('work', oldParentWork);
			}
			
			if (newParentId){
				var newParent = list.getByClientId(newParentId),
					newParentWork = newParent.get('work');
				
				newParentWork = newParentWork + parseInt(taskWork, 10);
				newParent.set('work', newParentWork);
			}
		},
		
		persistList: function(){
			var uri = '/data/tasks',
				cfg = {
					method: 'POST',
					headers: {
				        'Content-Type': 'application/json',
				    },
					data: Y.JSON.stringify({
							tasks: this.toJSON(),
							lastCount: Y.Task.lastCount,
							projectCalendar: Y.ProjectCalendar.data
						}),
					on: {
						start: function(transactionId, arguments){
							Y.log('Saving....');
						},
						
						complete: function(transactionId, response, arguments){
							Y.log('Done....');
						},
						
						success: function(transactionId, response, arguments){
							Y.log('Saved successfully');
						},
						
						failure: function(transactionId, response, arguments){
							Y.log('Failure: ' + response.statusText);
							Y.log('Failure: ' + response.status);
						},
						
						end: function(transactionId, arguments){
							
						}
					}/*,
					
					xdr: {use: 'native', dataType: 'text'}*/
				};
			Y.log(cfg.data);
			Y.io(uri, cfg);
		},
		
		loadFromServer: function(successFn){
			var uri = '/data/tasks',
				cfg = {
					method: 'GET',
					on: {
						start: function(transactionId, arguments){
							Y.log('Loading....');
						},
						
						complete: function(transactionId, response, arguments){
							Y.log('Done....');
						},
						
						success: function(transactionId, response, arguments){
							var res = Y.JSON.parse(response.responseText);
							Y.Task.lastCount = res.lastCount;
							arguments.modellist.reset(res.tasks);
							Y.ProjectCalendar.data = res.projectCalendar;
							successFn();
						},
						
						failure: function(transactionId, response, arguments){
							Y.log('Failure: ' + response.statusText);
							Y.log('Failure: ' + response.status);
							Y.log('Error loading data...');
						},
						
						end: function(transactionId, arguments){
							
						}
					},
					/*
					xdr: {use: 'native', dataType: 'text'} ,
					*/
					arguments: {modellist: this}
				};
			Y.io(uri, cfg, this);
		}
	});
});
