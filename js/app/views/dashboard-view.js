YUI.add('dashboard-view', function(Y){
	Y.namespace('PMApp').DashboardView = Y.Base.create('dashboardView', Y.View, [], {
		template: Y.Handlebars.compile(Y.one('#t-dashboard').getContent()),
			
		render: function(){
			Y.log('rendering dashboard view');
			var data = this.get('model'),
				content = this.template(data);
			this.get('container').setContent(content);
			return this;
		},
	}, {
		
	});
});
