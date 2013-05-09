/**
Provides the TreeModel to be used in TreeTable
@module tree-model
*/
YUI.add('tree-model', function(Y) {
	/**
	Y.Model derived class to represent, tree node
	@class TreeModel
	*/
	Y.TreeModel = Y.Base.create('treeModel', Y.Model, [], {
		initializer: function(config) {
			Y.log('TreeModel initializer: ');
			if (config) {
				this._set('children', new Y.ArrayList(config.children));
			} else {
				this._set('children', new Y.ArrayList());
			}
		},
		
		/**
		Returns count of child nodes
		@method getChildCount
		@return {Number} childCount
		*/
		getChildCount: function() {
			return this.get('children').size();
		}
	}, {
		ATTRS: {
			depthLevel: {
				value: 0
			},
			
			parent: {
			},

			children: {
			},

			collapsed: {
				value: false
			},

			visible: {
				value: true
			}
		}
	});
});