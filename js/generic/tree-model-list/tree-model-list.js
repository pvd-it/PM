YUI.add('tree-model-list', function(Y) {
	Y.TreeModelList = Y.Base.create('treeModelList', Y.ModelList, [], {
		model: Y.TreeModel,
		
		initializer: function(){
			this.on('add', this._addInterceptor);
			this.on('remove', this._removeInterceptor);
			this.on('*:depthLevelChange', this._childDepthChanging);
			this.after('*:collapsedChange', this._childCollapsedChanged);
		},
		
		_childDepthChanging: function(e){
			//If event was published with silent property as true, then ignore it.
			if (e.silent){
				return true;
			}
			
			var child = e.target,							//item whose depth is changing
				childProposedDepth = e.newVal,				//item's proposed depth
				childCurrentDepth = e.prevVal,				//item's current depth
				list = this,								//the list where item is attached to
				aboveIndex = list.indexOf(child)-1,			//Index of list item just above the item in consideration 
				newParent,									//variable to hold newParent of item in case we find one
				currentParentId = child.get('parent');		//item's current parent's id
				
			for (; aboveIndex >=0; aboveIndex--){			//Climb up the list looking for such an item, whose depth is one less than the current depth
				var listItem = list.item(aboveIndex);
				if ((childProposedDepth - listItem.get('depthLevel'))=== 1){
					newParent = listItem;					//Item found so now make this item as new parent
					break;
				}
			}
			
			if (newParent){
				this._changeParent(child, newParent);
			} else {										
				e.preventDefault();							//New parent not found so cancel the event of depthLevelChange
			}
		},
		
		_changeParent: function(child, newParent){
			var currentParentId = child.get('parent'),
				childClientId = child.get('clientId'),
				list = this,
				//Adjustment for the depth of descendants = child's new depth - child's current depth
				//child's new depth = newParent's depth + 1
				depthAdjustment = (newParent.get('depthLevel') + 1) - child.get('depthLevel');
				
				//If current parent is there, then remove the item from being a child of current parent
				if (currentParentId){						
					list.getByClientId(currentParentId).get('children').remove(childClientId);
				}
				
				newParent.get('children').add(childClientId); //Add the item as child of new parent
				child.set('parent', newParent.get('clientId'), {silent: true}); //Associate new parent with item
				
				//now change the depth of all the descendants of item
				var descendants = [];				
				this._findDescendants(child, descendants);
				Y.Array.each(descendants, function(descendant){
					var depthLevel = descendant.get('depthLevel');
					depthLevel = parseInt(depthLevel, 10) + depthAdjustment;
					descendant.set('depthLevel', depthLevel, {silent: true});
				});
		},
		
		_childCollapsedChanged: function(e){
			var collapsedChild = e.target;
			if (e.newVal) {
				this._collapseNode(this, collapsedChild);
			} else {
				this._expandNode(this, collapsedChild);
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
		
		_addInterceptor: function(e){
			var newClientId = e.model.get('clientId'),
				above = this.item(e.index-1),
				defaultParentClientId = above ? above.get('parent') : undefined;
			
			if (defaultParentClientId){
				e.model._set('parent', defaultParentClientId);
				this.getByClientId(defaultParentClientId).get('children').add(newClientId);
				e.model.set('depthLevel', above.get('depthLevel'), {silent: true});
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