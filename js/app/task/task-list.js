YUI.add('task-list', function(Y) {
	Y.TaskList = Y.Base.create('taskList', Y.TreeModelList, [], {
		
		model: Y.Task,
		
		initializer: function(){
			this.on('task:change', this._taskChangeInterceptor);
		},
		
		_taskChangeInterceptor: function(e){
			var task = e.target,
				list = this;
			
			if (e.changed.startDate){
				this._handleStartDateChange(task, e.changed.startDate.newVal);
			}
		},
		
		_handleStartDateChange: function(task, newStartDate){
			task.get('children').each(function(childTaskId){
				var childTask = this.getByClientId(childTaskId);
				childTask.set('startDate', newStartDate, {silent: true});
				this._handleStartDateChange(childTask, newStartDate);
			}, this);
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
						lastCount: Y.Task.lastCount
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
