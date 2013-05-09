YUI.add('inline-editor', function(Y) {

	Y.InlineEditor = Y.Base.create('inlineEditor', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign], {
				
		renderUI: function() {
			var contentBox = this.get('contentBox');
			
			contentBox
				.addClass('popover bottom')
				.append('<div class="arrow"></div>' +
						'<h3 class="popover-title">Edit Text</h3>' +
						'<div class="popover-content">' +
							'<input type="text" class="input-medium" />' +
							'<div class="btn-toolbar">' +
								'<div class="btn-group"><button class="btn btn-small btn-primary save">Save</button></div>' +
								'<div class="btn-group"><button class="btn btn-small btn-warning cancel">Cancel</button></div>' +
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