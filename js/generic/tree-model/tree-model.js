YUI.add('tree-model', function(Y) {
	Y.TreeModel = Y.Base.create('treeModel', Y.Model, [], {
		initializer: function(config){
			this._set('children', new Y.ArrayList(config.children));
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
			}
		}	
	});
});