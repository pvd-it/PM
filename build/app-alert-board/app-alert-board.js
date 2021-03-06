/*
 * This is an extension module for app for showing alert messages generated by various components in the app.
 */
YUI.add('app-alert-board', function(Y){
	
	var getClassName = Y.ClassNameManager.getClassName,
		YArray = Y.Array,
		AlertBoard;
	
	Y.namespace('App').AlertBoard = AlertBoard = function() {};
	
	AlertBoard.prototype = {
		initializer: function(){
			var self = this;
			
			self.alertArray = [];
			
			self.after('alert:closed', self._afterAlertClosed);
			Y.on('alert', Y.bind(self._afterAlertReceived, self));
			self.after('activeViewChange', self._afterActiveViewChangeAlertBoard);
			
			Y.Do.after(self._setupAlertBoard, self, 'render');
		},
		
		_setupAlertBoard: function(){
			var alertBoard = Y.one('.' + getClassName('app', 'alert', 'board'));
			this.alertBoard = alertBoard;
		},
		
		_afterAlertReceived: function(e){
			var alert = new Y.Alert({
				type: e.type,
				message: e.message
			});
			
			alert.preserveOnce = e.preserveOnce;
			this.alertArray.push(alert);
			//Make yourself target of alert, so that you can listen to closed event
			alert.addTarget(this);
			alert.render(this.alertBoard);
			this.alertBoard.scrollIntoView();
		},
		
		/**
		 * Handle alert close event
		 */
		_afterAlertClosed: function(e){
			var index = YArray.indexOf(this.alertArray, e.target);
			if (index >=0){
				YArray.remove(this.alertArray, index);
			}
			e.target.destroy();
		},
		
		/**
		 * whenever a new view comes up remove all previous alert messages generated by previous view.
		 * However there might be cases that you don't want to dismiss alert message even if view changes, for
		 * doing this set preserveOnce property to true while publishing the 'alert' event.
		 */
		_afterActiveViewChangeAlertBoard: function(){
			var self = this;
			YArray.each(self.alertArray, function(alertWidget){
				if (alertWidget.preserveOnce){
					delete alertWidget.preserveOnce;
				} else {
					alertWidget.close(true);
				}
			}, self);
		}

	};
});
