YUI.add('newproject-view', function(Y){
	
	Y.namespace('PMApp').NewProjectView = Y.Base.create('newProjectView', Y.View, [], {

		initializer: function(){
			this.template = Y.Handlebars.template(Y.HandlebarsTemplates['t-newproject']);
		},
	
		render: function(){
			var content = this.template(),
				project = this.get('model'),
				container = this.get('container');
			
			container.setContent(content);
			container.all('textarea').each(function(ta){
				ta.plug(Y.TextareaAutoheight);
			});
			
			if (project){
				container.one('#project-name').set('value', project.get('name'));
				container.one('#business-need').set('value', project.get('businessNeed'));
				container.one('#business-requirement').set('value', project.get('businessRequirement'));
				container.one('#business-value').set('value', project.get('businessValue'));
				container.one('#constraints').set('value', project.get('constraints'));
			}
			return this;
		},
		
		events: {
			'.btn-primary': {
				
				'click': function(e){
					e.halt();
					var self = this,
						container = self.get('container'),
						projectName = container.one('#project-name').get('value'),
						businessNeed = container.one('#business-need').get('value'),
						businessRequirement = container.one('#business-requirement').get('value'),
						businessValue = container.one('#business-value').get('value'),
						constraints = container.one('#constraints').get('value'),
						newValues = {
							name: projectName,
							businessNeed: businessNeed,
							businessRequirement: businessRequirement,
							businessValue: businessValue,
							constraints: constraints
						},
						existingProject = false,
						errorMessage,
						successMessage;
					
					if (!projectName || projectName.length <= 0) {
						Y.fire('alert', {
							type: 'error',
							message: 'Project name is required to create new project'
						});
					} else {
						var newProj = this.get('model');
						
						if (newProj){
							existingProject = true;
							newProj.setAttrs(newValues);
						} else {
							newProj = new Y.Project(newValues);
							Y.Task.lastCount = -1;
							var firstTask = new Y.Task({
								name: projectName,
								startDate: new Date(),
								work: 0
							});
							newProj.get('tasks').add(firstTask);
						}
						
						errorMessage = existingProject ? 'Some error occured while saving the project. Server returned: ' : 'Some error occured while creating the project. Server returned: ';
						
						newProj.save(function(err, response){
							if (err){
								Y.fire('alert', {
									type: 'error',
									message: errorMessage + err
								});
							}
							else {
								if (existingProject){
									self.fire('projectUpdated', {
										_id: newProj.get('_id'),
										name: projectName
									});
								} else {
									self.fire('projectCreated', {
										_id: newProj.get('_id'),
										name: projectName
									});
								}
							}
						});
					}
				}
			}
		},
	});
});