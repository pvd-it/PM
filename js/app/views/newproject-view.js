YUI.add('newproject-view', function(Y){
	
	Y.namespace('PMApp').NewProjectView = Y.Base.create('newProjectView', Y.View, [], {
	
		template: Y.Handlebars.compile(Y.one('#t-newproject').getContent()),
			
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
	
	});
});