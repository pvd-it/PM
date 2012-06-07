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
				strCredentials = Y.JSON.stringify(credentials);
				
			Y.ProjectManagement.io.send('/login', strCredentials, Y.bind(this._loginSuccess, this));
		},
		
		_loginSuccess: function(res) {
			this.fire('loginSuccess');
		}
	});	
});
