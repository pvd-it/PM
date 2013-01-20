YUI.add('datatable-tree-edit', function(Y) {
	var ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_ROW_INDEX	=	'activeRowIndex',
		SELECTION_IN_PROGRESS = 'selectionInProgress',
		DEPTH_LEVEL = 'depthLevel',
		YArray = Y.Array,
		TableTreeEdit;
				
	TableTreeEdit = function() {};
    
    TableTreeEdit.prototype = {
		
		doEdit: function(){
			if (this.get(ACTIVE_COL_INDEX) === this._knobColIndex) {
				this.toggle();
			} else {
				Y.DataTable.Edit.prototype.doEdit.call(this, arguments);
			}
		},
		
		indent: function(){
			var data = this.get('data'),
				row = this.get(ACTIVE_ROW_INDEX),
				item = data.item(row),
				isSelectionInProgress = this.get(SELECTION_IN_PROGRESS),
				allSame = true;
				
			if (isSelectionInProgress){
				var select = this._computeSelectionRegion(),
					i=select.startRow,
					firstItem = data.item(i), 
					parentId = firstItem.get('parent'),
					newParent;
				
				for(i++; i<=select.endRow; i++){
					if (data.item(i).get('visible') && data.item(i).get('parent') !== parentId) {
						allSame = false;
						break;
					}
				}
				
				if (allSame){
					newParent = data.indent(firstItem);
					if (newParent){
						for(i=select.startRow+1; i<=select.endRow; i++){
							if (data.item(i).get('visible')){
								data._changeParent(data.item(i), newParent);	
							}
						}
						item = firstItem;
					}
				}
			} else {
				data.indent(item);	
			}
			
			this._afterDataChange({newVal: data});
			
			if (item.get('visible')){
				this._afterSyncUI();	
			} else {
				this.moveUp();
			}
			
		},
		
		outdent: function() {
			var data = this.get('data'),
				row = this.get(ACTIVE_ROW_INDEX),
				item = data.item(row),
				isSelectionInProgress = this.get(SELECTION_IN_PROGRESS),
				allSame = true;

			if (isSelectionInProgress){
				var select = this._computeSelectionRegion(),
					i=select.startRow,
					firstItem = data.item(i), 
					parentId = firstItem.get('parent'),
					newParent,
					itemsToOutdent = [];
					
				itemsToOutdent.push(firstItem);
				
				for(i++; i<=select.endRow; i++){
					
					if (data.item(i).get('visible') && data.item(i).get('parent') == parentId) {
						itemsToOutdent.push(data.item(i));
					} else if (data.item(i).get('visible') && data.item(i).get('parent') !== parentId){
						allSame = false;
						break;
					}
				}
				
				if (allSame) {
					itemsToOutdent.reverse();
					YArray.each(itemsToOutdent, function(io){
						data.outdent(io);
					});
				}
				
			} else {
				data.outdent(item);	
			}
			
			this._afterDataChange({newVal: data});
			
			item = data.item(row);
			if (item.get('visible')){
				this._afterSyncUI();	
			} else {
				this.moveDown();
			}
		}
    }
    
    Y.DataTableTreeEdit = Y.Base.create('datatable', Y.DataTableTree, [TableTreeEdit]);
});