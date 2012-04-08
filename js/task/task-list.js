YUI.add('task-list', function(Y) {
	Y.TaskList = Y.Base.create('taskList', Y.ModelList, [], {
		
		model: Y.Task,
		
		initializer: function(){
			this.on('add', this._addInterceptor);
			this.on('remove', this._removeInterceptor);
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
		
		_addInterceptor: function(e){
			if (e.pos){
				e.index = e.pos;
				e.pos = e.pos-1;

				var newClientId = e.model.get('clientId'),
					above = this.item(e.pos),
					defaultParentClientId = above ? above.get('parent') : undefined;
				
				if (defaultParentClientId){
					e.model._set('parent', defaultParentClientId);
					this.getByClientId(defaultParentClientId).get('children').add(newClientId);
					e.model.set('depthLevel', above.get('depthLevel'), {silent: true});
				}
			}
		},
		
		_removeInterceptor: function(e){
			var descendants = [],
				clientId = e.model.get('clientId'),
				parentClientId = e.model.get('parent'),
				parent = this.getByClientId(parentClientId);
				
			if (parent){
				parent.get('children').remove(clientId);
			}		
			
			this._findDescendants(e.model, descendants);
			this.remove(descendants, {silent: true});			
		},
		
		_findDescendants: function(model, arr){
			model.get('children').each(function(item) {
				var modelItem = this.getByClientId(item); 
				arr.push(modelItem);
				this._findDescendants(modelItem, arr);
			},this);
		},
		
		persistList: function(){
			var uri = '/data',
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
		
		loadFromServer: function(){
			var uri = '/data',
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
