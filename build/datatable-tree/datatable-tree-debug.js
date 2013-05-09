/**
 Shows the data (of type `TreeModelList`) in tree table form
 Allows the tree handle to collapse/expand the subtree
 @module datatable-tree
 @requires tree-model-list
 @class DataTableTree
  
 @class DataTableTreeExt
 @extensionfor DataTableNavigate
 */
YUI.add('datatable-tree', function(Y) {
	var ACTIVE_ROW_INDEX = 'activeRowIndex',
		DIR_UP = 'UP',
		DIR_DOWN = 'DOWN',
		DataTableTreeExt,
		CLS_ROW_COLLAPSED,
		CLS_ROW_EXPANDED,
		CLS_ROW_HIDDEN,
		CLS_ROW_DEPTH,
		CLS_COL_TREE_KNOB,
		CLS_COL_TREE;

	Y.DataTableTreeExt = DataTableTreeExt = function(){};
	
	DataTableTreeExt.prototype = {
		/**
		Searches the columns attribute to find a column which is marked as treeKnob (via `sTreeKnob` property)
		(knob is used to expand or collapse child rows). Tree knob is rendered as arrow
		to show collapse or expanded state of node
		
		Searches the columns attribute to find a column which is makred as treeColumn (via `isTreeColumn` property).
		The tree hierarchy is shown in this column, where nodes are nested inside each other
		to show the tree
		@method initializer
		*/
		initializer : function() {
			var self = this;
			CLS_ROW_COLLAPSED = self.getClassName('tree', 'row', 'collapsed');
			CLS_ROW_EXPANDED = self.getClassName('tree', 'row', 'expanded');
			CLS_ROW_HIDDEN = self.getClassName('tree', 'row', 'hidden');
			CLS_ROW_DEPTH = self.getClassName('tree', 'row', 'depth', '');
			CLS_COL_TREE_KNOB = self.getClassName('tree', 'col', 'knob');
			CLS_COL_TREE = self.getClassName('tree', 'col');

			Y.Array.each(self.get('columns'), function(item, index) {
				if (item.isTreeKnob) {
					item.formatter = function(o) {
						o.className = o.className + ' ' + CLS_COL_TREE_KNOB;
						o.value = '';

						if (o.data.visible) {
							if (o.data.children.size() > 0) {
								if (o.data.collapsed) {
									o.rowClass = o.rowClass + ' ' + CLS_ROW_COLLAPSED;
								} else {
									o.rowClass = o.rowClass + ' ' + CLS_ROW_EXPANDED;
								}
							}
						} else {
							o.rowClass = o.rowClass + ' ' + CLS_ROW_HIDDEN;
						}
					};
					self._knobColIndex = index;
				} else if (item.isTreeColumn) {
					item.formatter = function(o) {
						o.rowClass = o.rowClass + ' ' + CLS_ROW_DEPTH + o.data.depthLevel;
						o.className = o.className + ' ' + CLS_COL_TREE;
					};
					self._treeColIndex = index;
				}
			}, self);
			
			self.keyBindings.plain = Y.merge(self.keyBindings.plain, {
				13: self.toggle
			});
		},

		/**
		Toggles the visibility of descendant nodes of a given parent node.
		If method is called, when a leaf node is active nothing happens.
		@method toggle
		*/
		toggle : function() {
			var self = this,
				rowIndex = self.get(ACTIVE_ROW_INDEX),
				model = self.get('data').item(rowIndex),
				collapsed = model.get('collapsed'),
				childCount = model.get('children').size();

			if (childCount === 0){
				return;
			}
			collapsed = !collapsed;
			model.set('collapsed', collapsed, {
				src : 'UI'
			});
		},

		/**
		Overrides the method to suit the tree table. Moving up now means moving to first visible row above the current row.
		Since in a tree table, there might be rows which are hidden (because ancestor node is collapsed), so
		while moving up we can't just go to previous row, need to find out the visible row
		@method moveUp
		*/
		moveUp : function() {
			Y.log('Y.DataTableTree moveUp');
			var self = this,
				row = self.get(ACTIVE_ROW_INDEX), modelList = self.get('data');

			for (row--; row >= 0; row--) {
				Y.log('Visibility is:' + modelList.item(row).get('visible'));
				if (modelList.item(row).get('visible')) {
					break;
				}
			}
			self._direction = DIR_UP;
			self.set(ACTIVE_ROW_INDEX, row);
		},
		
		/**
		Overrides the method to suit the tree table. Moving down now means moving to first visible row below the current row.
		Since in a tree table, there might be rows which are hidden (because ancestor node is collapsed), so
		while moving down we can't just go to next row, need to find out the visible row
		@method moveDown
		*/
		moveDown : function() {
			Y.log('Y.DataTableTree moveDown');
			var self = this,
				row = self.get(ACTIVE_ROW_INDEX), modelList = self.get('data'), maxRows = modelList.size();

			for (row++; row < maxRows; row++) {
				if (modelList.item(row).get('visible')) {
					break;
				}
			}
			self._direction = DIR_DOWN;
			self.set(ACTIVE_ROW_INDEX, row);
		}
	};

	Y.DataTableTree = Y.Base.mix(Y.DataTableNavigate, [DataTableTreeExt]);
});