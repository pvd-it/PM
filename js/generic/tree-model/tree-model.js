YUI.add('tree-model', function(Y) {
	Y.TreeModel = Y.Base.create('treeModel', Y.Model, [], {
		initializer: function(config){
			if (config) {
				this._set('children', new Y.ArrayList(config.children));
			} else {
				this._set('children', new Y.ArrayList());
			}
		},
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
			},
		}	
	});
});