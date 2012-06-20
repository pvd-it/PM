YUI.add('project-view', function(Y){
	Y.namespace('PMApp').ProjectView = Y.Base.create('projectView', Y.View, [], {
		template: Y.Handlebars.compile(Y.one('#t-project').getContent()),
			
		render: function(){
			Y.log('rendering project view');
			var content = this.template();
			this.get('container').setContent(content);
			return this;
		},
	}, {
		
	});
});
