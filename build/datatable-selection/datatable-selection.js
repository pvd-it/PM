/**
 Provides capability to select multiple cells.
 @module datatable-selection
 @class DataTableSelection
 */
YUI.add('datatable-selection', function(Y) {

	var ACTIVE_ROW_INDEX = 'activeRowIndex',
		ACTIVE_COL_INDEX = 'activeColIndex',
		CHANGE = 'Change',
		SELECTION_IN_PROGRESS = 'selectionInProgress',
		SELECTION_START = 'selectionStart',
		SELECTION_END = 'selectionEnd',
		navigateProto = Y.DataTableNavigate.prototype,
		CLS_SELECTION_MASK,
		CLS_SELECTION_MASK_ACTIVE;

	Y.DataTableSelection = Y.Base.create('datatable', Y.DataTableNavigate, [], {

		initializer : function() {
			var self = this;
			
			CLS_SELECTION_MASK = self.getClassName('selection', 'mask');
			CLS_SELECTION_MASK_ACTIVE = self.getClassName('selection', 'mask', 'active');
			
			self.after(SELECTION_IN_PROGRESS + CHANGE, self._afterSelectionInProgressChange);
			self.after(SELECTION_END + CHANGE, self._afterSelectionEndChange);
			
			Y.Do.after(self._afterRenderUISelection, self, 'renderUI');
			
			self.keyBindings = Y.merge(self.keyBindings, {
				shift: {
					35: self.selectToLastColumn,
					36: self.selectToFirstColumn,
					37: self.selectLeft,
					38: self.selectUp,
					39: self.selectRight,
					40: self.selectDown
				},
				ctrlshift: {
					35: self.selectToLastCell,
					36: self.selectToFirstCell
				}
			});
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveToLastColumn
		*/
		moveToLastColumn: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveToLastColumn.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveToFirstColumn
		*/
		moveToFirstColumn: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveToFirstColumn.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveLeft
		*/
		moveLeft: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveLeft.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveUp
		*/
		moveUp: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveUp.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveRight
		*/
		moveRight: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveRight.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveDown
		*/
		moveDown: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveDown.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveToLastCell
		*/
		moveToLastCell: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveToLastCell.apply(self, arguments);
		},
		
		/**
		Overriden from DataTableNavigate, so that selection is cleared
		@method moveToFirstCell
		*/
		moveToFirstCell: function(){
			var self = this;
			self.clearSelection();
			navigateProto.moveToFirstCell.apply(self, arguments);
		},
		
		/**
		Renders the selection mask. The idea here is to use a floating DIV element from startSelection
		to endSelection cell with a transparent background to show selection visually. This should save DOM
		node iteration of individual cells (td nodes) for adding/removing cell selection classes.
		@method _afterRenderUISelection
		@private
		*/
		_afterRenderUISelection: function(){
			var self = this,
				cb = self.get('contentBox');
			self._selectionMask = Y.Node.create('<div class="' + CLS_SELECTION_MASK + '"></div>');
			cb.append(self._selectionMask);
		},

		_afterSelectionInProgressChange : function(e) {
			if (!e.newVal) {
				this._uiClearSelection();
			} else {
				var row = this.get(ACTIVE_ROW_INDEX),
					col = this.get(ACTIVE_COL_INDEX);
				
				this.set(SELECTION_START, [row, col]);
			}
		},
		
		_afterSelectionEndChange: function(e){
			this._uiSyncSelection();
		},
		
		/**
		Clears the selection in datatable
		@method clearSelection
		*/
		clearSelection : function() {
			this.set(SELECTION_IN_PROGRESS, false);
		},
		
		/**
		Starts the selection if not started and moves selection till first column
		@method selectToFirstColumn
		*/
		selectToFirstColumn: function(){
			var self = this;
			self._startSelection();
			navigateProto.moveToFirstColumn.apply(self, arguments);
			self._doSelection();
		},
		
		/**
		Starts the selection if not started and moves selection till last column
		@method selectToLastColumn
		*/
		selectToLastColumn: function(){
			var self = this;
			self._startSelection();
			navigateProto.moveToLastColumn.apply(self, arguments);
			self._doSelection();
		},

		/**
		Starts the selection if not started and moves selection one row up
		@method selectUp
		*/
		selectUp : function() {
			var self = this;
			self._startSelection();
			navigateProto.moveUp.apply(self, arguments);
			self._doSelection();
		},

		/**
		Starts the selection if not started and moves selection one row down
		@method selectDown
		*/
		selectDown : function() {
			var self = this;
			self._startSelection();
			navigateProto.moveDown.apply(self, arguments);
			self._doSelection();
		},

		/**
		Starts the selection if not started and moves selection one col left
		@method selectLeft
		*/
		selectLeft : function() {
			var self = this;
			self._startSelection();
			navigateProto.moveLeft.apply(self, arguments);
			self._doSelection();
		},

		/**
		Starts the selection if not started and moves selection one col right
		@method selectRight
		*/
		selectRight : function() {
			var self = this;
			self._startSelection();
			navigateProto.moveRight.apply(self, arguments);
			self._doSelection();
		},
		
		/**
		Starts the selection if not started and moves selection till first cell
		@method selectToFirstCell
		*/
		selectToFirstCell: function(){
			var self = this;
			self._startSelection();
			navigateProto.moveToFirstCell.apply(self, arguments);
			self._doSelection();
		},
		
		/**
		Starts the selection if not started and moves selection till last cell
		@method selectToLastCell
		*/
		selectToLastCell: function(){
			var self = this;
			self._startSelection();
			navigateProto.moveToLastCell.apply(self, arguments);
			self._doSelection();
		},

		_startSelection : function() {
			var self = this,
				selectionInProgress = self.get(SELECTION_IN_PROGRESS);
				
			if (!selectionInProgress){
				self.set(SELECTION_IN_PROGRESS, true);
				self.set(SELECTION_START, [self.get(ACTIVE_ROW_INDEX), self.get(ACTIVE_COL_INDEX)]);
			}
		},

		_doSelection : function() {
			var row = this.get(ACTIVE_ROW_INDEX),
				col = this.get(ACTIVE_COL_INDEX);

			this.set(SELECTION_END, [row, col]);
		},

		_uiClearSelection : function() {
			this._selectionMask.removeClass(CLS_SELECTION_MASK_ACTIVE);
		},

		_computeSelectionRegion : function() {
			var startRow = this.get(SELECTION_START)[0],
				startCol = this.get(SELECTION_START)[1],
				endRow = this.get(SELECTION_END)[0],
				endCol = this.get(SELECTION_END)[1],
				fromRow, toRow, fromCol, toCol;

			if (startRow > endRow) {
				fromRow = endRow;
				toRow = startRow;
			} else {
				fromRow = startRow;
				toRow = endRow;
			}

			if (startCol > endCol) {
				fromCol = endCol;
				toCol = startCol;
			} else {
				fromCol = startCol;
				toCol = endCol;
			}

			return {
				startCell: [fromRow, fromCol],
				endCell: [toRow, toCol]
			};
		},

		_uiSyncSelection : function() {
			var self = this,
				region = self._computeSelectionRegion(),
				startTd = self.getCell(region.startCell),
				endTd = self.getCell(region.endCell),
				startRegion = startTd.get('region'),
				endRegion = endTd.get('region'),
				startXY = startTd.getXY(),
				maskWidth = endRegion.right - startRegion.left,
				maskHeight = endRegion.bottom - startRegion.top;
				
			self._selectionMask.addClass(CLS_SELECTION_MASK_ACTIVE);
			self._selectionMask.setXY(startXY);
			self._selectionMask.setStyles({
				width: maskWidth,
				height: maskHeight
			});
		}
	}, {
		ATTRS : {
			/**
			holds the position of starting cell [row, col]
			@attribute selectionStart
			@type Array
			*/
			selectionStart : {
			},

			/**
			holds the position of end cell [row, col]
			@attribute selectionEnd
			@type Array
			*/
			selectionEnd : {
			},

			/**
			signifies whether currently datatable has an active selection
			@attribute selectionInProgress
			@type boolean
			*/
			selectionInProgress : {
				value : false
			}
		}
	});

});