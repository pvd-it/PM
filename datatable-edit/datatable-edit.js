YUI.add('datatable-edit', function(Y) {
	var	CURRENT_CELL_XY	=	'currentCellXY',
		SELECTED_CELL	=	'selectedCell',
		CHANGE			=	'Change';
		
    function DatatableEditPlugin(config) {
        DatatableEditPlugin.superclass.constructor.apply(this, arguments);
    }

    DatatableEditPlugin.NAME = 'datatableEditPlugin';

    DatatableEditPlugin.NS = 'edit';     

    DatatableEditPlugin.ATTRS = {

        selectedCell : {
            value: null
        },
        
        currentCellXY: {
        	value: [0, 1],
        	validator: '_cellXYValidator'
        }
        
    };

    Y.extend(DatatableEditPlugin, Y.Plugin.Base, {

        initializer: function() {             
			this.after(CURRENT_CELL_XY+CHANGE, this._afterCurrentCellXYChange);
            this.after(SELECTED_CELL+CHANGE, this._afterSelectedCellChange);
            this.afterHostEvent('render', this._afterHostRenderEvent);
        },

        destructor : function() {
        },

        _afterHostRenderEvent : function(e) {
    		this._inEdit = new Y.InlineEditor({
					visible: false,
					zIndex: 1
			});
			this._inEdit.render();
			this._inEdit.after('cancel', Y.bind(this._cancelInEditing, this));
			this._inEdit.after('done', Y.bind(this._doneInEditing, this));
			
			this.get('host').get('boundingBox').on('key', Y.bind(this._keyHandler, this), 'down: 37, 38, 39, 40, 13, 45, 46, 35, 36');
			this.get('host').delegate('click', Y.bind(this._clickHandler, this), 'tbody td');
			this._syncSelectedCell();
        },
        
        _afterCurrentCellXYChange: function(e) {
        	this._syncSelectedCell();
        },
        
        _afterSelectedCellChange: function(e) {
        	if (e.prevVal) {
        		e.prevVal.removeClass('selectedCell');
        	}
        	
        	if (e.newVal) {
        		e.newVal.addClass('selectedCell');
        	}
        },
        
        _clickHandler: function(e) {
        	var rowId = e.currentTarget.get('parentNode').getData('yui3-record'),
        		colKey = this._getColKey(e.currentTarget),
        		colNum = Y.Array.indexOf(this.get('host').get('columns'), this.get('host')._columnMap[colKey]),
        		modelList = this.get('host').get('data'),
				model = modelList.getByClientId(rowId),
        		rowNum = this.get('host').get('data').indexOf(model);
        	
        	Y.log('colNum: ' + colNum + ' rowNum: ' + rowNum);
        	this.set(CURRENT_CELL_XY, [rowNum, colNum]);
        },
        
        _keyHandler: function(e) {
        	var cellXY = this.get(CURRENT_CELL_XY),
        		row = cellXY[0],
        		col = cellXY[1];
        	
			switch (e.keyCode) {
				case 37: //Left
					if (e.ctrlKey){
						this._outdentRow();
					} else {
						col && col--;	
					}
					break;
				case 38: //Up
					row && row--;
					break;
				case 39: //Right
					if (e.ctrlKey){
						this._indentRow();
					} else {
						col++;	
					}
					
					break;
				case 40: //Down
					row++;
					break;
				case 13: //Enter
					if (this.get(CURRENT_CELL_XY)[1] === 1){
						this._expandCollapse(row);
					} else {
						this._startInEditing();	
					}
					break;
				case 45: //Insert
					var index = e.shiftKey ? this.get(CURRENT_CELL_XY)[0] : this.get(CURRENT_CELL_XY)[0]+1;
					if(this.get('host').get('data').size() === 0){
						index = 0;
					}
					this.get('host').addRow({}, {pos: index});					
					row = index;
					break;
				case 46: //Delete
					if ((row+1) === this.get('host').get('data').size()){
						this.get('host').removeRow(row);
						row-=1;
					} else {
						this.get('host').removeRow(row);
					}
					break;
				case 35: //End
					col = this.get('host').get('columns').length-1;
					if (e.ctrlKey){
						row = this.get('host').get('data').size()-1;
					}
					break;
				case 36: //Home
					col = 0;
					if (e.ctrlKey){
						row = 0;
					}
					break;
			}
			e.preventDefault();
			this.set(CURRENT_CELL_XY, [row, col]);
		},
		
		_expandCollapse: function(row){
			var model = this.get('host').get('data').item(row);
				collapsed = model.get('collapsed');
			collapsed = !collapsed;
			model.set('collapsed', collapsed);
		},
		
		_indentRow: function(e){
			var list = this.get('host').get('data'),
				model = list.item(this.get(CURRENT_CELL_XY)[0]),
				depth = model.get('depthLevel');
			
			model.set('depthLevel', ++depth);
		},
		
		_outdentRow: function(e){
			var list = this.get('host').get('data'),
				model = list.item(this.get(CURRENT_CELL_XY)[0]),
				depth = model.get('depthLevel');
			
			model.set('depthLevel', --depth);
		},
		
		_startInEditing: function() {
			this._inEdit.show(this.get(SELECTED_CELL), this.get(SELECTED_CELL).get('innerHTML'));
        },
        
        _cancelInEditing: function(e) {
        	this.get('host').focus();
        },
        
        _getColKey: function(td){
        	return td.get('className').split(' ')[0].substring(19)
        },
        
        _doneInEditing: function(e) {
        	// TODO: Find a better way to locate column in modellist item
        	var colKey = this._getColKey(this.get(SELECTED_CELL));
        	var ml = this.get('host').get('data');
        	ml.item(this.get(CURRENT_CELL_XY)[0]).set(colKey, e.value);
        	this._syncSelectedCell();
        	this.get('host').focus();
        },
        
        _syncSelectedCell: function() {
        	var cellXY = this.get(CURRENT_CELL_XY),
        		cell = this.get('host').getCell(cellXY);
        	this.set(SELECTED_CELL, cell);
        },
        
        _cellXYValidator: function(val){
        	return (val && val[0] < this.get('host').get('data').size() && val[1] < this.get('host').get('columns').length);
        }
    });

    Y.namespace('Plugin').DatatableEditPlugin = DatatableEditPlugin;
});

