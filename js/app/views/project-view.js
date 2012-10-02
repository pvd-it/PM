YUI.add('project-view', function(Y){
	Y.namespace('PMApp').ProjectView = Y.Base.create('projectView', Y.View, [], {
		template: Y.Handlebars.template(Y.HandlebarsTemplates['t-project']),
			
		render: function(){
			Y.log('rendering project view');
			var data = this.get('model').toJSON(),
				content = this.template(data),
				container = this.get('container');
				
			container.setContent(content);
			return this;
		},
		
		events: {
			'.yui3-button-primary': {
				'click': function(e){
					e.halt();
					this.fire('editProjectOverview');
				}
			}
		}
	}, {
		
	});
});
