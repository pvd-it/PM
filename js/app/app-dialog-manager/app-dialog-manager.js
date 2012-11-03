/*
 * This is an extension module for app for showing dialog boxes before they take some potentially unsafe actions.
 */
YUI.add('app-dialog-manager', function(Y){
	var DialogManager;
	
	Y.namespace('App').DialogManager = DialogManager = function(){};
	
	DialogManager.prototype = {
		initializer: function(){
			var self = this;
			
			Y.Do.after(self._setupDialogManager, self, 'render');
			Y.on('*:appAction', Y.bind(self._interceptAppAction, self));
			
			self.dialogManagerMessages = Y.Intl.get('app-dialog-manager'); 
		},
		
		_setupDialogManager: function(){
			var dialog = new Y.ConfirmationDialog({
					srcNode: Y.one('.modal'),
					width        : 450,
			        zIndex       : 1050,
			        centered     : true,
			        modal        : true,
			        visible      : false,
			        render		 : true
				}),
				self = this;
			
			dialog.on('confirm', Y.bind(self._provideConfirmation, self));
			self.confirmationDialog = dialog;
		},
		
		_interceptAppAction: function(e){
			var self = this;
			
			if (e.confirmationRequired && !e.hasConfirmation){
				self._lastActionEvent = e;
				self.confirmationDialog.set('message', self.dialogManagerMessages[e.category + ':' + e.action]);
				self.confirmationDialog.show();
			}
		},
		
		_provideConfirmation: function(e){
			var lastEvent = this._lastActionEvent;
			lastEvent.hasConfirmation = true;
			Y.fire(lastEvent.category + ':appAction', lastEvent);
		}
	}
});