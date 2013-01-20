/**
Adds the capability to maintain active cell within the datatable.
Uses hidden text area hack to capture key strokes, builds foundation for copy and paste
@module datatable-navigate
@class Y.DataTableNavigate
@requires Y.DataTable.EventBindings
*/
YUI.add('datatable-navigate', function(Y) {

	var ACTIVE_ROW_INDEX = 'activeRowIndex',
		ACTIVE_COL_INDEX = 'activeColIndex',
		ACTIVE_CELL = 'activeCell',
		ACTIVE_ROW = 'activeRow',
		CHANGE = 'Change',
		DIR_UP = 'UP',
		DIR_DOWN = 'DOWN',
		DIR_LEFT = 'LEFT',
		DIR_RIGHT = 'RIGHT',
		DIR_NONE = 'NONE',
		CLS_ACTIVE_ROW,
		CLS_ACTIVE_CELL,
		CLS_CLIP;
	
	Y.DataTableNavigate = Y.Base.create('datatable', Y.DataTable, [Y.DataTable.EventBindings], {
		
		initializer : function() {

			var self = this;
			self.after(ACTIVE_ROW_INDEX + CHANGE, self._afterActiveRowIndexChange);
			self.after(ACTIVE_COL_INDEX + CHANGE, self._afterActiveColIndexChange);
			self.after(ACTIVE_CELL + CHANGE, self._afterActiveCellChange);
			self.after(ACTIVE_ROW + CHANGE, self._afterActiveRowChange);

			Y.Do.after(self._afterRenderUINavigate, self, 'renderUI');
			Y.Do.after(self._afterFocusNavigate, self, 'focus');
			Y.Do.after(self._afterSyncUINavigate, self, 'syncUI');

			CLS_ACTIVE_CELL = self.getClassName('navigate', 'activeCell');
			CLS_ACTIVE_ROW = self.getClassName('navigate', 'activeRow');
			CLS_CLIP = self.getClassName('navigate', 'clipboard');
			
			self.keyBindings = Y.merge(self.keyBindings, {
				plain: {
					35: self.moveToLastColumn,
					36: self.moveToFirstColumn,
					37: self.moveLeft,
					38: self.moveUp,
					39: self.moveRight,
					40: self.moveDown
				},
				
				ctrl: {
					35: self.moveToLastCell,
					36: self.moveToFirstCell
				}
			});
		},

		_activeRowIndexValidator : function(val) {
			var row = val, rowCount;

			//If row values are less than zero reject them
			if (row < 0) {
				return false;
			}

			//If row value is greater or equal (row value is zero based) than total rows it's invalid
			rowCount = this.get('data').size();
			if (row >= rowCount) {
				return false;
			}

			return true;
		},

		_activeColIndexValidator : function(val) {
			var col = val, columnCount;

			//If column values are less than zero reject them
			if (col < 0) {
				return false;
			}

			//If col value is greater or equal (col value is zero based) than visible columns it's invalid
			columnCount = this.get('columns').length;
			if (col >= columnCount) {
				return false;
			}

			return true;
		},

		/**
		Uses offscreen textarea hack to maintain focus on table
		@method _afterRenderUINavigate
		@private
		*/
		_afterRenderUINavigate : function() {

			var self = this,
				contentBox = self.get('contentBox');

			self._clipTextArea = Y.Node.create(Y.substitute('<textarea class="{className}"></textarea>', {
				className : CLS_CLIP
			}));
			contentBox.prepend(this._clipTextArea);
		},

		/**
		Invokes this method after focus method of widget, so that focus on textarea is set
		@method _afterFocusNavigate
		*/
		_afterFocusNavigate : function() {

			var self = this,
				trNode = self.get(ACTIVE_ROW);
			
			Y.later(0, self._clipTextArea, self._clipTextArea.focus);
			
			if (trNode) {
				self._scrollRowIntoView(trNode);
			}
		},

		_afterSyncUINavigate : function() {

			var self = this,
				row = self.get(ACTIVE_ROW_INDEX),
				col = self.get(ACTIVE_COL_INDEX),
				initialActiveRow = self.getRow(row),
				initialActiveCell = self.getCell([row, col]);

			self.set(ACTIVE_ROW, initialActiveRow);
			self.set(ACTIVE_CELL, initialActiveCell);
		},

		_afterActiveRowIndexChange : function(e) {
			var self = this,
				newTr = self.getRow(e.newVal),
				activeCell = self.getCell([e.newVal, self.get(ACTIVE_COL_INDEX)]);
			self.set(ACTIVE_ROW, newTr);
			self.set(ACTIVE_CELL, activeCell);
		},

		_afterActiveColIndexChange : function(e) {
			var self = this,
				activeCell = self.getCell([self.get(ACTIVE_ROW_INDEX), e.newVal]);
			self.set(ACTIVE_CELL, activeCell);
		},

		_afterActiveCellChange : function(e) {
			this._uiSetActiveCell(e.prevVal, e.newVal);
		},

		_afterActiveRowChange : function(e) {
			this._uiSetActiveRow(e.prevVal, e.newVal);
		},

		_uiSetActiveRow : function(trOldNode, trNewNode) {

			if (trOldNode) {
				trOldNode.removeClass(CLS_ACTIVE_ROW);
			}

			if (trNewNode) {
				trNewNode.addClass(CLS_ACTIVE_ROW);
				this._scrollRowIntoView(trNewNode);
			}
		},

		_scrollRowIntoView : function(trNewNode) {
			var dir = this._direction,
				nextTr;
			if (dir === DIR_NONE) {
				return;
			}

			if (!trNewNode.inRegion(trNewNode.get('viewportRegion'), true)) {
				if (dir === DIR_DOWN) {
					nextTr = trNewNode.next();
				} else if (dir === DIR_UP) {
					nextTr = trNewNode.previous();
				}

				if (nextTr) {
					nextTr.scrollIntoView();
				} else {
					trNewNode.scrollIntoView();
				}
			}
		},

		_uiSetActiveCell : function(tdOldNode, tdNewNode) {
			
			if (tdOldNode) {
				tdOldNode.removeClass(CLS_ACTIVE_CELL);
			}

			if (tdNewNode) {
				tdNewNode.addClass(CLS_ACTIVE_CELL);
			}
		},

		/**
		Moves the current active cell one row up. If you are already at top row does nothing
		@method moveUp
		*/
		moveUp : function() {
			var self = this,
				row = self.get(ACTIVE_ROW_INDEX);
			row = row - 1;
			self._direction = DIR_UP;
			self.set(ACTIVE_ROW_INDEX, row);
		},

		/**
		Moves the current active cell one row down. If you are already at bottom row does nothing
		@method moveDown
		*/
		moveDown : function() {
			var self = this,
				row = self.get(ACTIVE_ROW_INDEX);
			row = row + 1;
			self._direction = DIR_DOWN;
			self.set(ACTIVE_ROW_INDEX, row);
		},

		/**
		Moves the current active cell one col to left (prev col). If you are already on left most column does nothing
		@method moveLeft
		*/
		moveLeft : function() {
			var self = this,
				col = self.get(ACTIVE_COL_INDEX);
			col = col - 1;
			self._direction = DIR_LEFT;
			self.set(ACTIVE_COL_INDEX, col);
		},

		/**
		Moves the current active cell one col to right (next col). If you are already on right most column does nothing
		@method moveRight
		*/
		moveRight : function() {
			var self = this,
				col = self.get(ACTIVE_COL_INDEX);
			col = col + 1;
			self._direction = DIR_RIGHT;
			self.set(ACTIVE_COL_INDEX, col);
		},

		/**
		Moves the current active cell to first column of currently active row.
		@method moveToFirstColumn
		*/
		moveToFirstColumn : function() {
			this.set(ACTIVE_COL_INDEX, 0);
		},

		/**
		Moves the current active cell to last column of currently active row.
		@method moveToLastColumn
		*/
		moveToLastColumn : function() {
			var col = this.get('columns').length - 1;
			this.set(ACTIVE_COL_INDEX, col);
		},
		
		/**
		Moves the current active cell to 0,0 position (zero based)
		@method moveToFirstCell
		*/
		moveToFirstCell : function() {
			this.set(ACTIVE_ROW_INDEX, 0);
			this.set(ACTIVE_COL_INDEX, 0);
		},

		/**
		Moves the current active cell to n,k position (assuming table has n+1 rows and k+1 columns, zero based)
		@method moveToLastCell
		*/
		moveToLastCell : function() {
			var self = this,
				row = self.get('data').size() - 1,
				col = self.get('columns').length - 1;

			self.set(ACTIVE_ROW_INDEX, row);
			self.set(ACTIVE_COL_INDEX, col);
		},
		
		/**
		Marks the given td element as active cell
		@method setAsActiveCell
		@param {node} cellTd
		*/
		setAsActiveCell: function(cellTd){

			var self = this,
				tr = cellTd.get('parentNode'),
                currentItemClientId = tr.getAttribute('data-yui3-record'),
                data = self.get('data'),
                currentItem,
                row,
                col;
                
            currentItem = data.getByClientId(currentItemClientId);
            row = data.indexOf(currentItem);
            col = tr.get('children').indexOf(cellTd);
            
            self._set(ACTIVE_ROW_INDEX, row);
            self._set(ACTIVE_COL_INDEX, col);
            
            self.set(ACTIVE_ROW, tr);
            self.set(ACTIVE_CELL, cellTd);
		},
		
		/**
		Overrides the _mouseDownHandler
		@method _mouseDownHandler
		*/
		_mouseDownHandler: function(e){

			var self = this,
				clickedTd;
			clickedTd = e.domEvent.target.ancestor('td', true);
			if (clickedTd){
				self.setAsActiveCell(clickedTd);
			}
			
			Y.DataTable.EventBindings.prototype._mouseDownHandler.call(self, e);
		}
	},
	{
		ATTRS: {
			/**
			Currently active cell for the table
			@attribute activeCell
			@default cell at position 0, 0
			@type node
			*/
			activeCell : {
			},
	
			/**
			Currently active Row index (zero based)
			@attribute activeRowIndex
			@default 0
			*/
			activeRowIndex : {
				value : 0,
				validator : '_activeRowIndexValidator'
			},
	
			/**
			Currently active Column index (zero based)
			@attribute activeColIndex
			@default 0
			*/
			activeColIndex : {
				value : 0,
				validator : '_activeColIndexValidator'
			},
	
			/**
			Currently active row (tr)
			@attribute activeRow
			@default 0th row
			@type node (tr)
			*/
			activeRow : {
				value : null
			}
		}
	});
});