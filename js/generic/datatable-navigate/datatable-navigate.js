YUI.add('datatable-navigate', function(Y) {

	var	ACTIVE_ROW_INDEX	=	'activeRowIndex',
		ACTIVE_COL_INDEX 	= 	'activeColIndex',
		ACTIVE_CELL			=	'activeCell',
		ACTIVE_ROW			=	'activeRow',
		CHANGE				=	'Change',
		YLang				=	Y.Lang,
		DIR_UP				=	'UP',
		DIR_DOWN			=	'DOWN',
		DIR_LEFT			=	'LEFT',
		DIR_RIGHT			=	'RIGHT',
		CLS_ACTIVE_ROW,
		CLS_ACTIVE_CELL,
		CLS_CLIP,
		Navigate;
		
	Y.namespace('DataTable').Navigate = Navigate = function() {}
    
    Navigate.ATTRS = {
    	/*
    	 * Currently active cell for the table
    	 */
    	
    	activeCell: {
    		value: null
    	},

    	/*
    	 * Row and Column numbers of currently active cell (zero based)
    	 */
    	activeRowIndex: {
    		value: 0,
    		validator: '_activeRowIndexValidator'
    	},
    	
    	activeColIndex: {
    		value: 0,
    		validator: '_activeColIndexValidator'
    	},
    	
    	/*
    	 * Currently active row
    	 */
    	activeRow: {
    		value: null
    	},
    	
    	
    	selection: {
    		
    	}
    }
    
    Navigate.prototype = {
    	initializer: function() {
			this.after(ACTIVE_ROW_INDEX+CHANGE, this._afterActiveRowIndexChange);
			this.after(ACTIVE_COL_INDEX+CHANGE, this._afterActiveColIndexChange);
            this.after(ACTIVE_CELL+CHANGE, this._afterActiveCellChange);
            this.after(ACTIVE_ROW+CHANGE, this._afterActiveRowChange);
            
            Y.Do.after(this._afterRenderUI, this, 'renderUI');
            Y.Do.after(this._afterFocus, this, 'focus');
            Y.Do.after(this._afterSyncUI, this, 'syncUI');
            
            CLS_ACTIVE_CELL = this.getClassName('navigate', 'activeCell');
            CLS_ACTIVE_ROW = this.getClassName('navigate', 'activeRow');
            CLS_CLIP = this.getClassName('navigate', 'clipboard');
        },
        
        destructor: function() {
        },
        
        _activeRowIndexValidator: function(val){
        	var row = val,
        		rowCount;
        	
        	//If row values are less than zero reject them
        	if (row < 0) {
        		return false;
        	}
        	
        	//If row value is greater or equal (row value is zero based) than total rows it's invalid
        	rowCount = this.get('data').size();
        	if (row >= rowCount){
        		return false;
        	}
        	
        	return true;
        },
        
        _activeColIndexValidator: function(val){
        	var col = val,
        		columnCount;

        	//If column values are less than zero reject them        	
        	if (col < 0){
        		return false;
        	}
        	
        	//If col value is greater or equal (col value is zero based) than visible columns it's invalid
        	columnCount = this.get('columns').length;
        	if (col >= columnCount) {
        		return false;
        	}
        	
        	return true;
        },
        
        _afterRenderUI: function(){
        	var contentBox = this.get('contentBox');
        		
        	this._clipTextArea = Y.Node.create(Y.substitute('<textarea class="{className}"></textarea>',{className: CLS_CLIP}));
			contentBox.prepend(this._clipTextArea);
			
			Y.log('RenderUI');
        },
        
        _afterFocus: function(){
        	this._clipTextArea.focus();
        	var trNode = this.get(ACTIVE_ROW);
        	if (trNode){
        		this._scrollRowIntoView(trNode);	
        	}
        	Y.log('Focused....');
        },
        
        _afterSyncUI: function(){
        	var row = this.get(ACTIVE_ROW_INDEX),
        		col = this.get(ACTIVE_COL_INDEX),
        		initialActiveRow = this.getRow(row),
        		initialActiveCell = this.getCell([row, col]);
        	
        		this.set(ACTIVE_ROW, initialActiveRow);
        		this.set(ACTIVE_CELL, initialActiveCell);	
        },
        
        _afterActiveRowIndexChange: function(e){
        	var newTr = this.getRow(e.newVal);
        	this.set(ACTIVE_ROW, newTr);
        	
        	var activeCell = this.getCell([e.newVal, this.get(ACTIVE_COL_INDEX)]);
        	this.set(ACTIVE_CELL, activeCell);
        },
        
        _afterActiveColIndexChange: function(e){
        	var activeCell = this.getCell([this.get(ACTIVE_ROW_INDEX), e.newVal]);
        	this.set(ACTIVE_CELL, activeCell);
        },
        
        _afterActiveCellChange: function(e){
        	this._uiSetActiveCell(e.prevVal, e.newVal);
        },
        
        _afterActiveRowChange: function(e){
        	this._uiSetActiveRow(e.prevVal, e.newVal);
        },
        
        _uiSetActiveRow: function(trOldNode, trNewNode){
        	if (trOldNode){
        		trOldNode.removeClass(CLS_ACTIVE_ROW);	
        	}
        	
        	if (trNewNode){
        		trNewNode.addClass(CLS_ACTIVE_ROW);
        		this._scrollRowIntoView(trNewNode);	
        	}
        },
        
        _scrollRowIntoView: function(trNewNode){
			if(!trNewNode.inRegion(trNewNode.get('viewportRegion'), true)) {
				var nextTr;
				
				if (this._direction === DIR_DOWN) {
					nextTr = trNewNode.next(); 
				} else if (this._direction === DIR_UP){
					nextTr = trNewNode.previous();
				}
				
				if (nextTr){
					nextTr.scrollIntoView();
				} else {
					trNewNode.scrollIntoView();
				}
			}        	
        },
        
        _uiSetActiveCell: function(tdOldNode, tdNewNode){
        	if (tdOldNode) {
        		tdOldNode.removeClass(CLS_ACTIVE_CELL);
        	}
        	
        	if (tdNewNode){
        		tdNewNode.addClass(CLS_ACTIVE_CELL);
        	}
        },
        
        moveUp: function(){
        	var row = this.get(ACTIVE_ROW_INDEX);
        	row = row - 1;
        	this._direction = DIR_UP;
        	this.set(ACTIVE_ROW_INDEX, row);
        },
        
        moveDown: function(){
        	var row = this.get(ACTIVE_ROW_INDEX);
        	row = row + 1;
        	this._direction = DIR_DOWN;
        	this.set(ACTIVE_ROW_INDEX, row);
        },
        
        moveLeft: function(){
        	var col = this.get(ACTIVE_COL_INDEX);
        	col = col - 1;
        	this._direction = DIR_LEFT;
        	this.set(ACTIVE_COL_INDEX, col);
        },
        
        moveRight: function(){
        	var col = this.get(ACTIVE_COL_INDEX);
        	col = col + 1;
        	this._direction = DIR_RIGHT;
        	this.set(ACTIVE_COL_INDEX, col);
        },
        
        moveToFirstColumn: function(){
        	this.set(ACTIVE_COL_INDEX, 0);
        },
        
        moveToLastColumn: function(){
        	var col = this.get('columns').length - 1;
        	this.set(ACTIVE_COL_INDEX, col);
        },
        
        moveToFirstCell: function(){
        	this.set(ACTIVE_ROW_INDEX, 0);
        	this.set(ACTIVE_COL_INDEX, 0);
        },
        
        moveToLastCell: function(){
        	var row = this.get('data').size() - 1,
        		col = this.get('columns').length - 1;
        		
        	this.set(ACTIVE_ROW_INDEX, row);
        	this.set(ACTIVE_COL_INDEX, col);
        }
    }
    
    if (YLang.isFunction(Y.DataTable)) {
    	Y.Base.mix(Y.DataTable, [Navigate, Y.DataTable.NavigateKey]);
	}
});