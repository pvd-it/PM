YUI.add('datatable-schedule', function(Y) {
	var ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_ROW_INDEX	=	'activeRowIndex',
		SELECTION_IN_PROGRESS = 'selectionInProgress',
		DEPTH_LEVEL = 'depthLevel',
		YArray = Y.Array,
		TableSchedule;
				
	TableSchedule = function() {};
    
    TableSchedule.prototype = {
		
		doEdit: function() {
			var data = this.get('data'),
				row = this.get(ACTIVE_ROW_INDEX),
				col = this.get(ACTIVE_COL_INDEX),
				columns = this.get('columns'),
				item = data.item(row),
				currentCol = columns[col],
				key = currentCol.key,
				isParent = item.get('children').size() > 0;
			
			if (isParent){
				if (key === 'name' || key === 'startDate' || key === 'parent' || key === 'predecessors'){
					Y.DataTableTreeEdit.prototype.doEdit.call(this, arguments);
				}	
			} else {
				Y.DataTableTreeEdit.prototype.doEdit.call(this, arguments);
			}
		},
	}
 
    Y.DataTableSchedule = Y.Base.create('datatable', Y.DataTableTreeEdit, [TableSchedule]);
});