YUI.add('dashboard-view', function(Y){
	Y.namespace('PMApp').DashboardView = Y.Base.create('dashboardView', Y.View, [], {
		initializer: function(){
			this.template = Y.Handlebars.template(Y.HandlebarsTemplates['t-dashboard']);
		},
		
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
