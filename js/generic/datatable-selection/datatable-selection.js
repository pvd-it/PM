YUI.add('datatable-selection', function(Y) {
	
	var	ACTIVE_ROW_INDEX	=	'activeRowIndex',
		ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_CELL			=	'activeCell',
		ACTIVE_ROW			=	'activeRow',
		CHANGE				=	'Change',
		SELECTION_IN_PROGRESS = 'selectionInProgress',
		SELECTION_START = 'selectionStart',
		SELECTION_END = 'selectionEnd',
		CLS_SELECTED_CELL,
		CLS_SELECTED_CELL_L,
		CLS_SELECTED_CELL_R,
		CLS_SELECTED_CELL_T,
		CLS_SELECTED_CELL_B,
		Selection;
	
	
	Y.namespace('DataTable').Selection = Selection = function() {}
	
	Selection.ATTRS = {
    	selectionStart: {
    	},
    	
    	selectionEnd: {
    	},
    	
    	selectionInProgress: {
    		value: false
    	}
	}
	
	Selection.prototype = {
	
		initializer: function(){
			CLS_SELECTED_CELL = this.getClassName('selection', 'cell');
			
			CLS_SELECTED_CELL_L = this.getClassName('selection', 'cell', 'l');
			CLS_SELECTED_CELL_R = this.getClassName('selection', 'cell', 'r');
			CLS_SELECTED_CELL_T = this.getClassName('selection', 'cell', 't');
			CLS_SELECTED_CELL_B = this.getClassName('selection', 'cell', 'b');
			
			this.after(SELECTION_IN_PROGRESS+CHANGE, this._afterSelectionInProgressChange);
			this.after(SELECTION_END+CHANGE, this._afterSelectionEndChange);
			
			Y.Do.before(this._beforeMove, this, 'moveUp');
			Y.Do.before(this._beforeMove, this, 'moveDown');
			Y.Do.before(this._beforeMove, this, 'moveLeft');
			Y.Do.before(this._beforeMove, this, 'moveRight');
		},
		
		_afterSelectionInProgressChange: function(e){
			if (!e.newVal){
				this._uiClearSelection();
			} else {
				var row = this.get(ACTIVE_ROW_INDEX),
	    			col = this.get(ACTIVE_COL_INDEX);
	    			
	    		this.set(SELECTION_START, [row, col]);
			}
		},
		
		_beforeMove: function(clearSelection){
			if (!clearSelection){
				this.clearSelection();
			}
		},
		
		clearSelection: function () {
			this.set(SELECTION_IN_PROGRESS, false);
		},
		
	   	selectUp: function(){
	    	this._startSelection();
	    	this.moveUp(true);
	    	this._doSelection();
	    },
	    
	    selectDown: function(){
	    	this._startSelection();
	    	this.moveDown(true);
	    	this._doSelection();
	    },
	    
	    selectLeft: function(){
	    	this._startSelection();
	    	this.moveLeft(true);
	    	this._doSelection();
	    },
	    
	    selectRight: function(){
	    	this._startSelection();
	    	this.moveRight(true);
	    	this._doSelection();
	    },
	    
	    _startSelection: function(){
	    	this.set(SELECTION_IN_PROGRESS, true);
	    },
	    
	    _doSelection: function(){
	    	var inProgress = this.get(SELECTION_IN_PROGRESS),
	    		row = this.get(ACTIVE_ROW_INDEX),
	    		col = this.get(ACTIVE_COL_INDEX);
	    		
	    	this.set(SELECTION_END, [row, col]);
	    },
	    
	    _afterSelectionEndChange: function(){
	    	this._uiSyncSelection();
	    },
	    
	    _uiClearSelection: function(){
			Y.all('.' + CLS_SELECTED_CELL).removeClass(CLS_SELECTED_CELL)
										  .removeClass(CLS_SELECTED_CELL_B)
										  .removeClass(CLS_SELECTED_CELL_L)
										  .removeClass(CLS_SELECTED_CELL_R)
										  .removeClass(CLS_SELECTED_CELL_T);
		},
	    
	    _computeSelectionRegion: function(){
	    	var startRow = this.get(SELECTION_START)[0],
	    		startCol = this.get(SELECTION_START)[1],
	    		endRow = this.get(SELECTION_END)[0],
	    		endCol = this.get(SELECTION_END)[1];
	    		
	    	var fromRow, toRow, fromCol, toCol;
	    	
	   		if (startRow > endRow) {
	   			fromRow = endRow;
	   			toRow = startRow
	   		} else {
	   			fromRow = startRow;
	   			toRow = endRow;
	   		}
	   		
	   		if (startCol > endCol){
	   			fromCol = endCol;
	   			toCol = startCol;
	   		} else {
	   			fromCol = startCol;
	   			toCol = endCol;
	   		}
	   		
	   		return {
	   			startRow: fromRow,
	   			endRow: toRow,
	   			startCol: fromCol,
	   			endCol: toCol
	   		};
	    },
	    
	    _uiSyncSelection: function(){
	    	
	    	var fromRow, toRow, fromCol, toCol;
	   		
	   		var selectionRegion = this._computeSelectionRegion();
	   		
	   		fromRow = selectionRegion.startRow;
	   		toRow = selectionRegion.endRow;
	   		fromCol = selectionRegion.startCol;
	   		toCol = selectionRegion.endCol;
	   		
	   		this._uiClearSelection();
	   		
	   		for(var i=fromRow; i <= toRow; i++){
	   			for(var j=fromCol;j<= toCol; j++){
	   				var cell = this.getCell([i, j]);
	   				
	   				if (i===fromRow){
	   					cell.addClass(CLS_SELECTED_CELL_T);
	   				} 
	   				if (i===toRow){
	   					cell.addClass(CLS_SELECTED_CELL_B)
	   				}
	   				
	   				if (j===fromCol){
	   					cell.addClass(CLS_SELECTED_CELL_L);
	   				} 
	   				if (j===toCol){
	   					cell.addClass(CLS_SELECTED_CELL_R);
	   				}
	   				cell.addClass(CLS_SELECTED_CELL);
	   			}
	   		}
	    }
	}
});