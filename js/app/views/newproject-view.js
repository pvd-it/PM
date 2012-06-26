YUI.add('newproject-view', function(Y){
	
	Y.namespace('PMApp').NewProjectView = Y.Base.create('newProjectView', Y.View, [], {
	
		template: Y.Handlebars.compile(Y.one('#t-newproject').getContent()),
			
		render: function(){
			Y.log('rendering newproject view');
			var content = this.template();
			this.get('container').setContent(content);
			return this;
		},
		
		events: {
			'.yui3-button-primary': {
				'click': function(e){
					e.halt();
					
					var container = this.get('container'),
						projectName = container.one('#project-name').get('value'),
						businessNeed = container.one('#business-need').get('value'),
						businessRequirement = container.one('#business-requirement').get('value'),
						businessValue = container.one('#business-value').get('value'),
						constraints = container.one('#constraints').get('value');
					
					if (!projectName || projectName.length <= 0) {
						Y.fire('alert', {
							type: 'error',
							message: 'Project name is required to create new project'
						});
					} else {
						var newProj = new Y.Project({
							name: projectName,
							businessNeed: businessNeed,
							businessRequirement: businessRequirement,
							businessValue: businessValue,
							constraints: constraints
						});
						
						newProj.save(function(err, response){
							if (err){
								Y.fire('alert', {
									type: 'error',
									message: 'Some error occured while creating the project. Server returned: ' + err
								});
							}
							else {
								Y.fire('alert', {
									type: 'success',
									message: 'Project created successfully'
								});
							}
						});
					}
				}
			}
		},
	});
});