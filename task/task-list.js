YUI.add('task-list', function(Y) {
	Y.TaskList = Y.Base.create('taskList', Y.ModelList, [], {
		
		model: Y.Task,
		
		initializer: function(){
			this.on('add', this._addInterceptor);
			this.on('remove', this._removeInterceptor);
		},
		
		_addInterceptor: function(e){
			e.index = e.pos;
			
			e.pos = e.pos-1;
			if (e.pos){
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
		}
	});
});
