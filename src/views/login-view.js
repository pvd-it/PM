YUI.add('login-view', function(Y){
	Y.namespace('PMApp').LoginView = Y.Base.create('loginView', Y.View, [], {
		render: function(){
			this.set('container', Y.one('.main div'));
			return this;
		}
	});	
});
