YUI.add('datatable-edit', function(Y) {
	var Edit,
	ACTIVE_CELL			=	'activeCell',
	ACTIVE_ROW_INDEX	=	'activeRowIndex',
	ACTIVE_COL_INDEX 	= 	'activeColIndex',
	SELECTION_IN_PROGRESS = 'selectionInProgress',
	YLang = Y.Lang,
	YArray = Y.Array,
	YObject = Y.Object;
			
	Y.namespace('DataTable').Edit = Edit = function() {}
    
    Edit.prototype = {
    	
    	initializer: function(){
    		Y.Do.after(this._applyCss, this, 'render');
        	Y.Do.after(this._renderInlineEditors, this, 'renderUI');
        },
        
        _renderInlineEditors: function(){
        	var ies = this.get('inlineEditors'),
        		bb = this.get('boundingBox');
        	
        	YObject.each(ies, function(val, key, o){
        		 val.set('constrainNode', bb);
        		 val.render();
        	});
        },
        
        _bindUIEdit: function(editor){
        	if (this._editorEventHandle){
        		YArray.each(this._editorEventHandle, function(eh){
        			eh.detach();
        		});
        	} else {
        		this._editorEventHandle = [];
        	}
        	this._editorEventHandle.push(editor.after('cancel', Y.bind(this._cancelEdit, this)));
        	this._editorEventHandle.push(editor.after('done', Y.bind(this._doneEdit, this)));
        },
        
        _cancelEdit: function(e) {
        	this.focus();
        },
        
        _doneEdit: function(e){
        	var cellTd = this.get(ACTIVE_CELL),
        		data = this.get('data'),
        		columns = this.get('columns'),
        		row = this.get(ACTIVE_ROW_INDEX),
        		col = this.get(ACTIVE_COL_INDEX),
        		item = data.item(row),
        		key = columns[col]['key'];
        	
        	item.set(key, e.value, {src: 'UI'});
			this._afterSyncUI();
        	this.focus();
        },
        
        doEdit: function(){
        	var cellTd = this.get(ACTIVE_CELL),
        		data = this.get('data'),
        		columns = this.get('columns'),
        		row = this.get(ACTIVE_ROW_INDEX),
        		col = this.get(ACTIVE_COL_INDEX),
        		item = data.item(row),
        		currentCol = columns[col],
        		key = columns[col]['key'],
        		inlineEditors = this.get('inlineEditors'),
        		value,
        		editor;
        		
        	editor = inlineEditors[currentCol.inlineEditor];
        	
        	if (!editor){
				return;
			}
        	
        	if (columns[col].editFromNode){
        		value = cellTd.get('text');
        	} else {
        		value = item.get(key);	
        	}
        	
    		this._bindUIEdit(editor);
    		editor.show(cellTd, value);
    	},
        
        doCopy: function(){
        	var isSelectionInProgress = this.get(SELECTION_IN_PROGRESS),
        		copyContent;
        	
        	if (isSelectionInProgress){
        		var data = this.get('data'),
        			columns = this.get('columns'),
        			selectionRegion = this._computeSelectionRegion(),
        			row, col, buffer=[], model;
        			
        		for (row=selectionRegion.startRow; row <= selectionRegion.endRow; row++){
        			model = data.item(row);
        			for(col=selectionRegion.startCol; col<=selectionRegion.endCol; col++){
        				if (columns[col].editFromNode) {
        					buffer.push(this.getCell([row, col]).get('innerHTML'));
        				} else {
        					buffer.push(model.get(columns[col].key));		
        				}
        			
        				buffer.push('\t');
        			}
        			buffer.push('\n')
        		}
        		
        		copyContent = buffer.join('');
        		        			
        	} else {
				copyContent = this.get(ACTIVE_CELL).get('innerHTML');
        	}
        	
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
        		
        	if (this.get(SELECTION_IN_PROGRESS)){
        		
        	}
        		
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
					dataRow.setAttrs(itemData);
					row++;
				} else {
					dataRow = new recordType(itemData);
					data.add(dataRow);
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
        },
        
        _applyCss: function(){
			var bb = this.get('boundingBox'),
				tableNode = bb.one('table');
				
			tableNode.addClass('table table-striped table-bordered table-condensed');
		}
    }
    
    Edit.ATTRS = {
    	inlineEditors: {}
    }
    
    if (YLang.isFunction(Y.DataTable)) {
    	Y.Base.mix(Y.DataTable, [Edit]);
	}
});