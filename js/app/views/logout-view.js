YUI.add('logout-view', function(Y){
	Y.namespace('PMApp').LogoutView = Y.Base.create('logoutView', Y.View, [], {
		
		template: Y.Handlebars.compile(Y.one('#t-logout').getContent()),
		
		render: function(){
			Y.log('rendering newproject view');
			var content = this.template();
			this.get('container').setContent(content);
			return this;
		},
		
		
		doLogout: function(){
			var self = this,
				iocfg = {
					method: 'GET',
					context: self,
					on: {
						success: self._logoutSuccess,
						failure: self._logoutFailure,
					}
					
				};
			
			Y.io('/logout', iocfg);
		},
		
		_logoutFailure: function(tid, res) {
				Y.fire('alert', {
					type: 'error',
					message: 'Some problem occured during logout. Please close the browser <strong>window</strong> to finish.'
				});
		},
		
		_logoutSuccess: function(tid, res) {
			this.fire('logoutSuccess');
			Y.log('success fully logged out');
		},
	});	
});
