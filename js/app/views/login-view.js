YUI.add('login-view', function(Y){
	Y.namespace('PMApp').LoginView = Y.Base.create('loginView', Y.View, [], {
		template: Y.Handlebars.compile(Y.one('#t-login').getContent()),
		
		render: function(){
			var content = this.template();
			
			this.get('container').setContent(content);
			
			return this;
		},
		
		events: {
			'form': {submit: 'doLogin'}
		},
		
		doLogin: function(e){
			e.halt();
			var container = this.get('container'),
				userId = container.one('#username').get('value'),
				password = container.one('#password').get('value'),
				credentials = {userId: userId, password: password},
				strCredentials = Y.JSON.stringify(credentials),
				self = this,
				iocfg = {
					method: 'POST',
					headers: {
				        'Content-Type': 'application/json',
				    },
					data: strCredentials,
					context: self,
					on: {
						success: self._loginSuccess,
						failure: self._loginFailure,
					}
					
				};
			
			Y.io('/login', iocfg);
		},
		
		_loginFailure: function(tid, res) {
			if (res.status === 401) {
				Y.fire('alert', {
					type: 'error',
					message: 'Invalid credentials. Please check and try again.'
				});
			} else if (res.status === 400){
				Y.fire('alert', {
					type: 'warning',
					message: 'Looks like your session is messed up. Try logging out and then back in'
				})
			}
		},
		
		_loginSuccess: function(tid, res) {
			this.fire('loginSuccess');
		},
	});	
});
