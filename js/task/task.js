YUI.add('task', function(Y) {
	Y.Task = Y.Base.create('task', Y.Model, [], {
		initializer: function(config){
			if (config && config.clientId){
				this._set('clientId', config.clientId);	
			} else {
				var generatedId = this.constructor.NAME + '_' +  (++Y.Task.lastCount);
				this._set('clientId', generatedId);
			}
			
			this._set('children', new Y.ArrayList(config.children));
			this.on('depthLevelChange', this._depthChanging);
			this.after('collapsedChange', this._collapseChanging);
		},
		
		_collapseChanging: function(e){
			var list = this.lists[0],
				model = this;
			
			if (e.newVal) {
				this._collapseNode(list, model);
			} else {
				this._expandNode(list, model);
			}
		},
		
		_collapseNode: function(list, model){
			model.get('children').each(function(item){
				var child = list.getByClientId(item);
				child.set('visible', false, {silent: true});
				this._collapseNode(list, child);
			}, this);
		},
		
		_expandNode: function(list, model){
			model.get('children').each(function(item){
				var child = list.getByClientId(item);
				child.set('visible', true, {silent: true});
				if (child.get('collapsed')){
					// Do nothing since child is collapsed, it's children will already be hidden. 
					// No need to open them as we would like to keep the child state untouched
				} else {
					this._expandNode(list, child);
				}
			}, this);
		},
		
		_depthChanging: function(e){
			if (e.silent){
				return true;
			}
			
			var newVal = e.newVal,
				prevVal = e.prevVal;
						
			var list 	= this.lists[0],
				index	= (list) ? (list.indexOf(this)-1) : -1,
				newParent,
				currentParentId = this.get('parent'),
				selfClientId = this.get('clientId');
				
			for (; index >=0; index--){
				var currentItem = list.item(index);
				if ((newVal - currentItem.get('depthLevel')) === 1) {
					newParent = currentItem;
					break;
				}
			}
			
			if (!newParent){
				e.preventDefault();
			} else {
				if (currentParentId){
					list.getByClientId(currentParentId).get('children').remove(selfClientId);
				}
				newParent.get('children').add(selfClientId);
				this.set('parent', newParent.get('clientId'), {silent: true});
				this._adjustDescendantsDepth(list, this, (newVal - prevVal));
			}
		},
		
		_adjustDescendantsDepth: function(list, parent, adjustment){
			var children = parent.get('children'),
				childCount = children ? children.size() : 0,
				child, childDepthLevel, i;
			
			for (i=0;i<childCount;i++){
				child = list.getByClientId(children.item(i));
				childDepthLevel = child.get('depthLevel');
				childDepthLevel = parseInt(childDepthLevel, 10) + adjustment;
				child.set('depthLevel', childDepthLevel, {silent: true});
				this._adjustDescendantsDepth(list, child, adjustment);
			}
		},
		
		toJSON: function () {
			var attrs = this.getAttrs();
			
			delete attrs.destroyed;
			delete attrs.initialized;
			
			if (this.idAttribute !== 'id') {
				delete attrs.id;
			}
			
			return attrs;
		},
	}, {
		ATTRS: {
			name: {

			},
		
			startDate: {

			},
		
			endDate: {
		
			},
		
			isFixedDuration: {
				value: false
			},
		
			work: {
				value: 8
			},
			
			duration: {
				value: 1
			},
			
			parentTask: {
				
			},
			
			depthLevel: {
				value: 0
			},
			
			parent: {
				
			},
			
			children: {
				
			},
			
			collapsed: {
				value: false
			},
			
			visible: {
				value: true
			},
			
			clientId: {
				valueFn: undefined
			}
		}	
	});
});
