YUI.add('inline-editor', function(Y) {

	Y.InlineEditor = Y.Base.create('inlineEditor', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign], {
				
		renderUI: function() {
			var contentBox = this.get('contentBox');
			
			contentBox.append(	'<div class="notch-border">' +
									'<div class="notch"></div>' + 
								'</div>' +
								'<div class="callout">' +
									'<input type="text" />' +
									'<div class="buttonContainer"></div>' +
								'</div>');
			
			this._saveButton = new Y.Button({
				label: 'Save'
			});
			this._cancelButton = new Y.Button({
				label: 'Cancel'
			});
			contentBox.one('.buttonContainer').append(this._saveButton.getNode()).append(this._cancelButton.getNode());
			this._inputNode = contentBox.one('input');
		},
		
		bindUI: function() {
			var boundingBox = this.get('boundingBox');
			boundingBox.delegate('key', Y.bind(this._onEscEnter, this), 'down:esc, enter', 'input');
			this._saveButton.on('click', Y.bind(this._doDone, this));
			this._cancelButton.on('click', Y.bind(this._doCancel, this));
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
