/**
Provides cell editing capabilities through inline editors.
Provides Y.DataTableEdit class and Y.DataTableEditExt extension.
@module datatable-edit
@class DataTableEdit
*/
YUI.add('datatable-edit', function(Y) {
	var ACTIVE_CELL = 'activeCell',
		ACTIVE_ROW_INDEX = 'activeRowIndex',
		ACTIVE_COL_INDEX = 'activeColIndex',
		YArray = Y.Array, YObject = Y.Object,
		Ext;
		
	
	Y.DataTableEditExt = Ext = function(){
		
	};
	
	Ext.ATTRS = {
		/**
		Holds instances of inlineEditors to use for editing cell content
		@attribute inlineEditors
		@type object
		@default empty
		*/
		inlineEditors : {}
	};
	
	Ext.prototype = {
		initializer : function() {
			var self = this;
			Y.Do.after(self._renderInlineEditors, self, 'renderUI');
			
			//Since datatable body view is not created untill syncUI phase, so after syncUI is right place to hook navigation sync method
			Y.Do.after(self._hookSyncUIAfterBodyRender, self, 'syncUI');
			
			self.keyBindings.plain = Y.merge(self.keyBindings.plain, {
				45: self.addAfterCurrentRow,
				46: self.deleteCurrentRow,
				13: self.doEdit
			});
			self.keyBindings.shift = Y.merge(self.keyBindings.shift, {
				45: self.addBeforeCurrentRow
			});
		},
		
		/**
		Creates a hook to call _afterSyncUINavigate method after rendering of table body
		@method _hookSyncUIAfterBodyRender
		@private
		*/
		_hookSyncUIAfterBodyRender: function(){
			var self = this;

			Y.Do.after(self._afterSyncUINavigate, self.body, 'render', self);
		},

		/**
		Renders inlineEditors contraining them to BoundingBox of the DataTable widget.
		@method _renderInlineEditors
		@private
		*/
		_renderInlineEditors : function() {
			var self = this,
				ies = self.get('inlineEditors'),
				bb = self.get('boundingBox');

			YObject.each(ies, function(val, key, o) {
				val.set('constrainNode', bb);
				val.render();
			});
		},

		/**
		The inline editors are supposed to emit two events 'cancel' and 'done'. These events will be listened for only when an inlineEditor
		is active, i.e. some cell is getting edited.
		@method _bindUIEdit
		@private
		*/
		_bindUIEdit : function(editor) {
			var self = this,
				editorEventHandles = [];

			editorEventHandles.push(editor.after('cancel', Y.bind(self._cancelEdit, self)));
			editorEventHandles.push(editor.after('done', Y.bind(self._doneEdit, self)));
			
			self._editorEventHandles = editorEventHandles;
		},
		
		/**
		As soon as one of the event ('done' or 'cancel') is fired, we unsubscribe from the inlineEditor
		@method _unbindUIEdit
		@private
		*/
		_unbindUIEdit: function(){
			var editorEventHandles = this.editorEventHandles;
			
			if (editorEventHandles) {
				YArray.each(editorEventHandles, function(eh) {
					eh.detach();
				});
			}
		},

		/**
		The 'cancel' event handler for inlineEditor 'cancel' event. It unsubscribes the event hooks and moves focus back to datatable
		@method _cancelEdit
		@private
		*/
		_cancelEdit : function(e) {
			var self = this;
			
			self._unbindUIEdit();
			self.focus();
		},

		/**
		The 'done' event handler for inlineEditor 'done' event. It unsubscribes the event hooks and calls edit function,
		if specified in columns property of datatable. This function receives the event object returned by inlineEditor, the item to be modified
		and eventFacade which will be passed to set the value of current item attribute.
		@method _doneEdit
		@private
		*/
		_doneEdit : function(e) {
			var self = this,
				data = self.get('data'),
				columns = self.get('columns'),
				rowIndex = self.get(ACTIVE_ROW_INDEX),
				colIndex = self.get(ACTIVE_COL_INDEX),
				item = data.item(rowIndex),
				key = columns[colIndex].key,
				column = columns[colIndex],
				columnFunction = column.editFunction,
				eventFacade = {
					src : 'UI'
				};

			self._unbindUIEdit();
			
			if (columnFunction) {
				columnFunction(e, item, eventFacade);
			}

			item.set(key, e.value, eventFacade);
			self.focus();
		},

		/**
		This method is supposed to be called by a keyboard event handler or other component
		which wants the inlineEditor for currently active cell to appear and allow user to start editing.
		If currently active cell has no corresponding inlineEditor then nothing will happen.
		@method doEdit
		*/
		doEdit : function() {
			var self = this,
				cellTd = self.get(ACTIVE_CELL),
				data = self.get('data'),
				columns = self.get('columns'),
				row = self.get(ACTIVE_ROW_INDEX),
				col = self.get(ACTIVE_COL_INDEX),
				item = data.item(row),
				currentCol = columns[col],
				key = columns[col].key,
				inlineEditors = self.get('inlineEditors'),
				value,
				editor;

			editor = inlineEditors[currentCol.inlineEditor];

			if (!editor) {
				return;
			}

			if (columns[col].editFromNode) {
				value = cellTd.get('text');
			} else {
				value = item.get(key);
			}

			self._bindUIEdit(editor);
			editor.show(cellTd, value);
		},

		/**
		Adds an empty model after the currently active row and makes the new row as active row
		@method addAfterCurrentRow
		*/
		addAfterCurrentRow : function() {
			var self = this,
				data = self.get('data'),
				indexToAddAt = self.get(ACTIVE_ROW_INDEX) + 1,
				RecType = self.get('recordType');

			data.add(new RecType(), {
				index : indexToAddAt
			});
			self.set(ACTIVE_ROW_INDEX, indexToAddAt);
		},

		/**
		Adds an empty model before the currently active row and makes the new row as active row
		@method addBeforeCurrentRow
		*/
		addBeforeCurrentRow : function() {
			var self = this,
				data = self.get('data'),
				indexToAddAt = self.get(ACTIVE_ROW_INDEX),
				RecType = self.get('recordType');

			data.add(new RecType(), {
				index : indexToAddAt
			});
			self.set(ACTIVE_ROW_INDEX, indexToAddAt);
		},

		/**
		Removes the current row (actually model from the modelist at current row index). If datatable contains no
		rows then this method just returns.
		If you deleted the last row, a row prior to it will be set as active row. Otherwise the row following the deleted
		row will become currently active row.
		@method deleteCurrentRow
		*/
		deleteCurrentRow : function() {
			var self = this,
				data = self.get('data'),
				row, model;
				
			if (data.size() === 0) {
				return;
			}

			row = self.get(ACTIVE_ROW_INDEX);
			model = data.item(row);

			data.remove(model);

			if (data.size() === row) {
				/*
				 * If you deleted last model from list then ACTIVE_ROW_INDEX will be same as size of list.
				 * So reduce the ACTIVE_ROW_INDEX by one to point to last item in list (remember ACTIVE_ROW_INDEX is zero based)
				 */
				self.set(ACTIVE_ROW_INDEX, row - 1);
			}
		}
	};

	Y.DataTableEdit = Y.Base.mix(Y.DataTableNavigate, [Ext]);
});