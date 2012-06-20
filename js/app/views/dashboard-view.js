YUI.add('dashboard-view', function(Y){
	Y.namespace('PMApp').DashboardView = Y.Base.create('dashboardView', Y.View, [], {
		template: Y.Handlebars.compile(Y.one('#t-dashboard').getContent()),
			
		render: function(){
			Y.log('rendering dashboard view');
			var content = this.template();
			this.get('container').setContent(content);
			return this;
		},
	}, {
		
	});
});
