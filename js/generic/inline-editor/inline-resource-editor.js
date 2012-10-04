YUI.add('inline-resource-editor', function(Y) {

	var KEY_ENTER = 13,
    	KEY_ESC   = 27,
    	YLang = Y.Lang,
    	YArray = Y.Array;
	
	Y.InlineResourceEditor = Y.Base.create('inlineEditor', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign], 
	{
		initializer: function(){
			var self = this;
		},
		
		renderUI: function() {
			var contentBox = this.get('contentBox'),
				source = this.get('resources'),
				listToEdit = this.get('listToEdit');
				
			contentBox
				.addClass('popover bottom yui3-skin-sam')
				.append('<div class="arrow"></div>' +
						'<h3 class="popover-title">Choose Resources</h3>' +
						'<div class="popover-content">' +
							'<div class="editorContainer"></div>' +
							'<div class="btn-toolbar">' +
								'<div class="btn-group"><button class="btn btn-small btn-primary save">Save</button></div>' +
								'<div class="btn-group"><button class="btn btn-small btn-warning cancel">Cancel</button></div>' +
							'</div>'+
						'</div>'); 
			
			this.lb = new Y.ListBuilder({
				width: '250px',
				height: 'auto',
				listToEdit: listToEdit,
				resultTextLocator: function(result){
					return result.get('name');
				},
				source: source,
			});
			this.lb.render(contentBox.one('.editorContainer'));
		},
		
		bindUI: function() {
			var boundingBox = this.get('boundingBox'),
				self = this;
				
			boundingBox.delegate('click', Y.bind(self._doDone, self), '.save');
			boundingBox.delegate('click', Y.bind(self._doCancel, self), '.cancel');
			
			self.lb._inputNode.on('keydown', this._onInputKey, this);
			
			/*
			 * HACK AUTOCOMPLETE KEY HANDLERS TO PROVIDE INFORMATION
			 * 
			 * The hack is required to identify if it's okay to close inline editor or not.
			 * If autocomplete suggestion list is open then pressing escape should close the autocomplete suggestion list
			 * not the inline editor.
			 * 
			 * Similary if autocompelte suggestion is open then pressing enter should choose the selected item and should not
			 * close the inline editor.
			 * 
			 * However if autocomplete doesn't handle the event (if list is not visible and no results) then pressing enter should
			 * close inline-editor by signaling 'done' event. Similary pressing escape should close the inline-editor 
			 * by signaling 'cancel' event.
			 * 
			 * Intercept autocomplete key handlers to tell inline-resource-editor 
			 * that event is already handled by autocomplete by setting e.achandled = true;
			 */
			self.lb.ac._keysVisible[KEY_ENTER] = function(e){
				e.acHandled = true;
				this._keyEnter(e);
			}
			self.lb.ac._keysVisible[KEY_ESC] = function(e){
				e.acHandled = true;
				this._keyEsc(e);
			}
		},
		
		_onInputKey: function(e){
			var self = this;
			
			/*
			 * If e.acHandled is false, i.e., this key event is not handled by autocomplete
			 * then check if it's KEY_ENTER then _doDone or if it's KEY_ESC then _doCancel
			 * 
			 */
			if (!e.acHandled){
				if (e.keyCode === KEY_ENTER){
					self._doDone();
				} else if (e.keyCode === KEY_ESC){
					self._doCancel();
				}
			}
		},
		
		show: function(node, val) {
			var self = this;
			
			//clone the array before passing it to list builder. If you don't do this then original array gets modified
			//even if user didn't press enter or save button. Slice at 0 will shallow clone the array which is sufficient for
			//our need here.
			if(YLang.isArray(val)){
				val = val.slice(0);
			}
			
			self.lb.set('listToEdit', val);
			self.set('visible', true);
			self.align(node, [Y.WidgetPositionAlign.BR, Y.WidgetPositionAlign.BL]);
			self.lb._inputNode.focus();
		},
		
		_onEscEnter: function(e) {
			if(e.keyCode === 27) {
				this._doCancel();
			} else if(e.keyCode === 13) {
				this._doDone();
			}
			e.halt();
		},
		
		_doDone: function(){
			var self = this;
			
			self.hide();
			self.fire('done', {
				value: self.lb.get('listToEdit'),
			});
		},
		
		_doCancel: function(){
			this.hide();
			this.fire('cancel');
		}
	}, {
		ATTRS: {
			resources: {},
		}
	});
});
