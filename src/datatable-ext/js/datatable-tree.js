YUI.add('datatable-tree', function(Y) {
	var ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_ROW_INDEX	=	'activeRowIndex', 
		DIR_UP				=	'UP',
		DIR_DOWN			=	'DOWN',
		TableTree,
		CLS_ROW_COLLAPSED,
		CLS_ROW_EXPANDED,
		CLS_ROW_HIDDEN,
		CLS_ROW_DEPTH,
		CLS_COL_TREE_KNOB,
		CLS_COL_TREE,
		YLang = Y.Lang;
			
	TableTree = function() {};
    
    TableTree.prototype = {
		initializer: function(config){
			CLS_ROW_COLLAPSED = this.getClassName('tree', 'row', 'collapsed');
			CLS_ROW_EXPANDED = this.getClassName('tree', 'row', 'expanded');
			CLS_ROW_HIDDEN = this.getClassName('tree', 'row', 'hidden');
			CLS_ROW_DEPTH = this.getClassName('tree', 'row', 'depth', '');
			CLS_COL_TREE_KNOB = this.getClassName('tree', 'col', 'knob');
			CLS_COL_TREE = this.getClassName('tree', 'col');
			
			Y.Array.each(this.get('columns'), function(item, index){
				if(item.isTreeKnob){
					item.formatter = function(o){
					 	o.className = o.className + ' ' + CLS_COL_TREE_KNOB;
					 	o.value = '';
					 	
					 	if (o.data.visible){
					 		if (o.data.children.size() > 0){
					 			if (o.data.collapsed){
									o.rowClass = o.rowClass + ' ' + CLS_ROW_COLLAPSED;				 				
					 			} else {
					 				o.rowClass = o.rowClass + ' ' + CLS_ROW_EXPANDED;
					 			}
					 		}
					 	} else {
					 		o.rowClass = o.rowClass + ' ' + CLS_ROW_HIDDEN;
					 	}
					};
					this._knobColIndex = index;
				} else if(item.isTreeColumn) {
					item.formatter = function(o) {
					 	o.rowClass = o.rowClass + ' ' + CLS_ROW_DEPTH + o.data.depthLevel;
					 	o.className = o.className + ' ' + CLS_COL_TREE;
					}
					this._treeColIndex = index;
				}
			}, this);
		},
		
		toggle: function(){
			var rowIndex	= this.get(ACTIVE_ROW_INDEX), 
				model 		= this.get('data').item(rowIndex),
				collapsed 	= model.get('collapsed');
			
			
			collapsed = !collapsed;
			model.set('collapsed', collapsed, {src: 'UI'});
			
			this._afterSyncUI();
		},
		
		moveUp: function(){
        	var row = this.get(ACTIVE_ROW_INDEX),
        		modelList = this.get('data');
        		
        	for(row--;row >=0; row--){
        		if (modelList.item(row).get('visible')){
        			break;
        		}
        	}
        	this._direction = DIR_UP;
        	this.set(ACTIVE_ROW_INDEX, row);
        },
        
        moveDown: function(){
        	var row = this.get(ACTIVE_ROW_INDEX),
        		modelList = this.get('data'),
        		maxRows = modelList.size();
        		
        	for(row++; row < maxRows; row++){
        		if (modelList.item(row).get('visible')){
        			break;
        		}
        	}
        	this._direction = DIR_DOWN;
        	this.set(ACTIVE_ROW_INDEX, row);
        },
    }
    
    Y.DataTableTree = Y.Base.create('datatable', Y.DataTable, [TableTree]);
});