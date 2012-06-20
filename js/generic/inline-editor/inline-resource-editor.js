YUI.add('inline-resource-editor', function(Y) {

	Y.InlineResourceEditor = Y.Base.create('inlineEditor', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign], {
				
		renderUI: function() {
			var contentBox = this.get('contentBox');
			
			contentBox.append(	'<div class="notch-border">' +
									'<div class="notch"></div>' + 
								'</div>' +
								'<div class="callout">' +
									'<div class="editorContainer" />' +
									'<div class="buttonContainer">' +
										'<button class="save">Save</button>' +
										'<button class="cancel">Cancel</button>' +
									'</div>' +
								'</div>');
			
			this.lb = new Y.ListBuilder({
				width: '400px',
				height: 'auto',
				listToEdit: [],
				acConfig: {
					resultFilters: ['startsWith'],
					resultHighlighter: 'startsWith',
					resultTextLocator: function(result){
						return result.get('name');
					},
				}
			});
			this.lb.render(contentBox.one('.editorContainer'));
		},
		
		bindUI: function() {
			var boundingBox = this.get('boundingBox');
			boundingBox.delegate('key', Y.bind(this._onEscEnter, this), 'down:esc, enter', 'input');
			boundingBox.delegate('click', Y.bind(this._doDone, this), '.save');
			boundingBox.delegate('click', Y.bind(this._doCancel, this), '.cancel');
		},
		
		show: function(node, val) {
			this.set('visible', true);
			this.align(node, [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]);
		
			var source = Y.Project.Resources.toArray();
			this.lb.ac.set('source', source);		
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
