YUI.add('inline-editor', function(Y) {

	Y.InlineEditor = Y.Base.create('inlineEditor', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign], {
				
		renderUI: function() {
			var contentBox = this.get('contentBox');
			
			contentBox.append(	'<div class="notch-border">' +
									'<div class="notch"></div>' + 
								'</div>' +
								'<div class="callout">' +
									'<input type="text" />' +
									'<div class="buttonContainer">' +
										'<button class="save">Save</button>' +
										'<button class="cancel">Cancel</button>' +
									'</div>' +
								'</div>');
			
			this._inputNode = contentBox.one('input');
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
			var inputNode = this._inputNode;
			val = val ? val : '';
			inputNode.set('value', val);
			inputNode.select();
			inputNode.focus();
		},
		
		_onEscEnter: function(e) {
			if(e.keyCode === 27) {
				this._doCancel();
			} else if(e.keyCode === 13) {
				this._doDone();
			}
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
