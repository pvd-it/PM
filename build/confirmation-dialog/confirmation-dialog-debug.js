YUI.add('confirmation-dialog', function (Y) {
	
	var EVT_CONFIRM = 'confirm',
		EVT_CANCEL = 'cancel';
	
	Y.ConfirmationDialog = Y.Base.create('confirmation-dialog', Y.Widget, [
	    // Other Widget extensions depend on these two.
	    Y.WidgetPosition,
	    Y.WidgetModality,
	    Y.WidgetAutohide,
	    Y.WidgetPositionAlign,
	    Y.WidgetPositionConstrain,
	    Y.WidgetStack
		], {
			initializer: function(){
				var self = this;
				
				self._uiHandles = [];
				
				self.publish(EVT_CONFIRM);
				self.publish(EVT_CANCEL);
				
				self.after('messageChange', self._afterMessageChange);
			},
			
			bindUI: function(){
				var self = this,
					bb = self.get('boundingBox'),
					uiHandles = self._uiHandles;
					
				uiHandles.push(
					bb.delegate('click', Y.bind(self._cancel, self), '.close, .cancel'),
					bb.delegate('click', Y.bind(self._confirm, self), '.btn-primary'),
					bb.on('key', Y.bind(self._confirm, self), 'down:enter')
				);
			},
			
			syncUI: function(){
				var self = this;
				
				self._uiSetMessage(self.get('message'));
			},
			
			_afterMessageChange: function(e){
				this._uiSetMessage(e.newVal);
			},
			
			_uiSetMessage: function(msg){
				var self = this;
				
				self.get('contentBox').one('.modal-body').setContent(msg);
			},
			
			_cancel: function(e){
				var self = this;
				self.hide();
				self.fire(EVT_CANCEL);
			},
			
			_confirm: function(e){
				var self = this;
				self.hide();
				self.fire(EVT_CONFIRM);
			},
			
			destructor: function(){
				Y.each(this._uiHandles, function(h){
                	h.detach();
            	});
			}
		}, {
			ATTRS: {
				message: {
					value: '<p>To continue press "Enter" or click on "Confirm". To cancel press "Esc" or click on "Cancel"<p>'
				}
			}
		});
});