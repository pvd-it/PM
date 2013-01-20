YUI.add('inline-date-editor', function(Y) {

	Y.InlineDateEditor = Y.Base.create('inlineEditor', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign], {

		renderUI : function() {
			var contentBox = this.get('contentBox');
			contentBox.addClass('popover bottom yui3-skin-sam').append(
							'<div class="arrow"></div>' +
							'<h3 class="popover-title">Choose Date</h3>' +
							'<div class="popover-content">' +
								'<div class="editorContainer"></div>' +
								'<div class="btn-toolbar">' +
									'<div class="btn-group"><button class="btn btn-small btn-primary save">Save</button></div>' +
									'<div class="btn-group"><button class="btn btn-small btn-warning cancel">Cancel</button></div>' +
								'</div>' +
							'</div>');

			this._calendar = new Y.Calendar({
				contentBox : contentBox.one('.editorContainer'),
				width : 'auto',
				showPrevMonth : true,
				showNextMonth : true,
				date : new Date()
			}).render();
		},

		bindUI : function() {
			var boundingBox = this.get('boundingBox');
			boundingBox.on('key', Y.bind(this._onEscEnter, this), 'down:esc');
			this._calendar.after('selectionChange', Y.bind(this._doDone, this));
			boundingBox.delegate('click', Y.bind(this._doCancel, this), '.cancel');
		},

		show : function(node, val) {
			this.set('visible', true);
			if (val) {
				this._calendar.set('date', val);
			}
			this._calendar.show();
			this.align(node, [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]);
			var cal = this._calendar;
			val = val ? val : '';
			cal.focus();
		},

		_onEscEnter : function(e) {
			if (e.keyCode === 27) {
				this._doCancel();
			} else if (e.keyCode === 13) {
				this._doDone();
			}
			e.halt();
		},

		_doDone : function(e) {
			this.hide();
			this._calendar.hide();
			var val = e.newSelection[0];
			this.fire('done', {
				value : val
			});
		},

		_doCancel : function(e) {
			this.hide();
			this._calendar.hide();
			this.fire('cancel');
		}
	}, {

	});
});
