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
			Y.log('doLogin' + e);
			this.fire('loginSuccess');
			e.halt();
		}
	});	
});
