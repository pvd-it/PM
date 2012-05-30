YUI.add('inline-autocomplete-editor', function(Y) {
	
	var YNode = Y.Node;
	
	Y.InlineAutoCompleteEditor = Y.Base.create('inlineEditor', Y.Panel, [], {
		
		initializer: function(config){
			this.addButton({
				name: 'save',
				label: 'Save',
				action: '_doDone'
			});
			
			this.addButton({
				name: 'cancel',
				label: 'Cancel',
				action: '_doCancel'
			});

			this.set('modal', true);
			this.set('hideOn', []);
			this.set('focusOn', []);
			this.set('constrain', config.constrainNode);
		},
		
		renderUI: function(){
			
			var nodeMarkup = YNode.create('<div><input type="text" /></div>');
			
			this._inputNode = nodeMarkup.one('input');
			this._ac = new Y.AutoComplete({
				inputNode: this._inputNode,
				resultFilters: ['startsWith'],
				resultHighlighter: 'startsWith',
				resultTextLocator: function(result){
					return result.get('name');
				}
			});
			this._ac.render();
			
			this.setStdModContent(Y.WidgetStdMod.BODY, nodeMarkup);
		},
		
		bindUI: function(){
			var boundingBox = this.get('boundingBox');
			boundingBox.delegate('key', Y.bind(this._onEscEnter, this), 'down:esc, enter');
		},
		
		show: function(node, val) {
			this.set('visible', true);
			var source = Y.Project.Resources;
			this._ac.set('source', source);
			this.align(node, [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]);
			
			this._inputNode.focus();
		},
		
		_onEscEnter: function(e) {
			if(e.keyCode === 27) {
				this._doCancel();
			} else if(e.keyCode === 13) {
				this._doDone();
			}
			e.halt();
		},
		
		_doDone: function(val){
			this.hide();
			this.fire('done', {
				value: this._inputNode.get('value')
			});
		},
		
		_doCancel: function(val){
			this.hide();
			this.fire('cancel');
		}
	}, {
		
	});
});
