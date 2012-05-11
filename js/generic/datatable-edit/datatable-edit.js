YUI.add('datatable-edit', function(Y) {
	var Edit,
	ACTIVE_CELL			=	'activeCell',
	ACTIVE_ROW_INDEX	=	'activeRowIndex',
	ACTIVE_COL_INDEX 	= 	'activeColIndex',
	YLang = Y.Lang,
	YArray = Y.Array;
			
	Y.namespace('DataTable').Edit = Edit = function() {}
    
    Edit.prototype = {
        
        doCopy: function(){
        	var copyContent = this.get(ACTIVE_CELL).get('innerHTML');
        	this._clipTextArea.set('value', copyContent);
        	this._clipTextArea.select();
        },
        
        doPaste: function(pasteString){
        	var row = this.get(ACTIVE_ROW_INDEX),
        		col = this.get(ACTIVE_COL_INDEX),
        		data = this.get('data'),
        		dataRow,
        		recordType = this.get('recordType'),
        		dataCol = this.get('columns'),
        		dataColLength = dataCol.length,
        		count = data.size(),
        		lineTokens = pasteString.split('\n'),
        		silent = true,
        		lastIndex = lineTokens.length -1;
        		
			YArray.each(lineTokens, function(lineToken, index){
				//Publish change event when we are pasting last item,
				//Better approach would be to call table re-rendering explicitly
				if (index === lastIndex){
					silent = false;
				}
				
				tabTokens = lineToken.split('\t');
				
				var itemData = {};
				YArray.each(tabTokens, function(tabToken, i){
					var dataColIndex = col + i;
					if (dataColIndex < dataColLength){
						itemData[dataCol[col + i]['key']] = tabToken;	
					} 
				});
				
				if (row < count && count > 0){
					dataRow = data.item(row);
					dataRow.setAttrs(itemData, {silent: silent});
					row++;
				} else {
					dataRow = new recordType(itemData);
					data.add(dataRow, {silent: silent});
				}
			}, this);
			
			//Since changing any row data causes the Table to re-render, so we need to make sure that
			//currenlty active cell is also synced up
			this._afterSyncUI();
        },
        
        addAfterCurrentRow: function(){
        	var data = this.get('data'),
        		indexToAddAt = this.get(ACTIVE_ROW_INDEX) + 1,
        		recType = this.get('recordType');

        	data.add(new recType(), {index: indexToAddAt});
        	
        	this._set(ACTIVE_ROW_INDEX, indexToAddAt);
        	this._afterSyncUI();
        },
        
        addBeforeCurrentRow: function(){
        	var data = this.get('data'),
        		indexToAddAt = this.get(ACTIVE_ROW_INDEX),
        		recType = this.get('recordType');	
        	
        	data.add(new recType(), {index: indexToAddAt});
        	this._set(ACTIVE_ROW_INDEX, indexToAddAt);
        	this._afterSyncUI();
        },
        
        deleteCurrentRow: function(){
        	var data = this.get('data');
        	if(data.size()===0){
        		return;
        	}	
        	
        	var	row = this.get(ACTIVE_ROW_INDEX),
        		model = data.item(row);
        	
        	data.remove(model);
        	
        	if (data.size() === row){
        		/*
	        	 * If you deleted last model from list then ACTIVE_ROW_INDEX will be same as size of list.
	        	 * So reduce the ACTIVE_ROW_INDEX by one to point to last item in list (remember ACTIVE_ROW_INDEX is zero based)
	        	 * Since the ACTIVE_ROW_INDEX value has changed (reduced by 1) we don't need to call _afterSyncUI, as the change
	        	 * event will take care of updating ACTIVE_ROW and ACTIVE_CELL.
	        	 */
        		this.set(ACTIVE_ROW_INDEX, row-1);
        	} else {
        		/*
        		 * ACTIVE_ROW_INDEX has not changed but table is re-rendered, so need to call _afterSyncUI explicitly
        		 * to sync the ACTIVE_ROW and ACTIVE_CELL
        		 */
        		this._afterSyncUI();	
        	}
        }
    }
    
    if (YLang.isFunction(Y.DataTable)) {
    	Y.Base.mix(Y.DataTable, [Edit]);
	}
});