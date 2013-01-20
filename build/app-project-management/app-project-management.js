YUI.add('app-project-management', function(Y){
	var App;
	
	Y.namespace('ProjectManagement');
	
	Y.ProjectManagement.App = App = Y.Base.create('appProjectManagement', Y.App, [
		Y.App.Dropdown, Y.PMApp.Nav, Y.PMApp.Login, Y.AppBaseFix, Y.App.AlertBoard, Y.App.DialogManager
	], {
		views: {
			login		:	{type: Y.PMApp.LoginView, preserve: false},
			logout		:	{type: Y.PMApp.LogoutView, preserve: false,
								pageHeader: 'Logout', pageHeaderTeaser: ' is successful, so you are'},
			project		:	{type: Y.PMApp.ProjectView, preserve: false,
								pageHeader: 'Overview', pageHeaderTeaser: '', subNav: true},
			schedule	:	{type: Y.PMApp.ScheduleView, preserve: false, parent: 'login',
								pageHeader: 'Schedule', pageHeaderTeaser: '', subNav: true},
			resource	:	{type: Y.PMApp.ResourceView, preserve: false, parent: 'schedule',
								pageHeader: 'Team', pageHeaderTeaser: '', subNav: true},
			gantt		:	{type: Y.PMApp.GanttView, preserve: false, parent: 'schedule',
								pageHeader: 'Gantt', pageHeaderTeaser: '', subNav: true},
			newproject	:	{type: Y.PMApp.NewProjectView, preserve: false, pageHeader: 'Create a Project',
								pageHeaderTeaser: 'to manage it better'},
			dashboard	:	{type: Y.PMApp.DashboardView, preserve: false, pageHeader: 'Dashboard',
								pageHeaderTeaser: 'is where you see all your projects, tasks and notifications'},
			usersettings:	{type: Y.PMApp.UserSettingsView, preserve: true, pageHeader: 'Personalize',
								pageHeaderTeaser: 'to your own preferences'},
			workflow	:	{type: Y.PMApp.WorkflowView, preserve: false, pageHeader: 'Workflow',
								pageHeaderTeaser: 'visualizes project', subNav: true}
		},
		
		initializer: function(){
			var self = this;
			
			self.after('loginSuccess', self._afterLoginSuccess);
			
			self.after('currentUserChange', self._afterCurrentUserChange);
			self.after('currentProjectChange', self._afterCurrentProjectChange);
			
			self.on('*:editProjectOverview', self._onEditProjectOverview);
			self.on('*:projectCreated', self._onProjectCreateUpdate);
			self.on('*:projectUpdated', self._onProjectCreateUpdate);
			
			Y.after('projectActions:appAction', Y.bind(self._performProjectAction, self));
		},

		showView: function(view){
			var self = this,
				pageHeaderText = self.views[view] && self.views[view].pageHeader,
				pageHeaderTeaserText = self.views[view] && self.views[view].pageHeaderTeaser,
				str;
			
			if (pageHeaderText){
				str = '<h1>' + pageHeaderText + ' ';
				if (pageHeaderTeaserText) {
					str = str + '<small>' + pageHeaderTeaserText + '</small>';
				}
				str = str + '</h1>';
				//this.pageHeader.set('innerHTML', str);
			}
			Y.AppBaseFix.prototype.showView.apply(this, arguments);
		},
		
		render: function(){
			App.superclass.render.apply(this, arguments);
		},
		
		_performProjectAction: function(e){
			if (e.confirmationRequired) {
				if (!e.hasConfirmation){
					return;
				}
			}
			
			var self = this;
			
			switch(e.action){
				case 'save':
					self._saveCurrentProject(e);
				break;
					
				case 'discard':
					self._reloadCurrentProject(e);
				break;
				
				case 'export':
					self._exportCurrentProject(e);
				break;
				
				case 'delete':
					self._deleteCurrentProject(e);
				break;
				
				case 'schedule':
					Y.ProjectDependencyGraph.calculateSchedule(self.get('currentProject').get('tasks'));
				break;
			}
		},
		
		_reloadCurrentProject: function(e){
			var self = this;
			
			self.get('currentProject').load(function(err, res){
				if (err){
					Y.fire('alert', {
						type: 'error',
						message: 'Unable to load project. Please try again.'
					});
					return;
				}
				
				Y.fire('alert', {
					type: 'warning',
					message: 'Discarded changes made. Project has been reloaded.'
				});
			});
		},
		
		_exportCurrentProject: function(e){
			var self = this,
				obj = self.get('currentProject').serialize();
		},
		
		_deleteCurrentProject: function(e){
			var self = this;
			self.get('currentProject').destroy({remove: true}, function(err, response){
				if (err){
					Y.fire('alert', {
						type: 'error',
						message: 'Some error occured while removing the project. Server returned: ' + err
					});
				} else {
					Y.fire('alert', {
						type: 'info',
						message: 'Project was deleted successfullly'
					});
				}
			});
		},
		
		_saveCurrentProject: function(e){
			var self = this;
			self.get('currentProject').save(function(err, response){
				if (err){
					Y.fire('alert', {
						type: 'error',
						message: 'Some error occured while saving the project. Server returned: ' + err
					});
				}
				else {
					Y.fire('alert', {
						type: 'success',
						message: 'Project saved successfullly'
					});
				}
			});
		},
		
		_afterLoginSuccess: function(e){
			this.set('currentUser', e.user);
			this.replace('/dashboard');
		},
		
		_afterCurrentUserChange: function(e){
			this.isAuthenticated = true;
		},
		
		_afterCurrentProjectChange: function(e){
			var newProj = e.newVal,
				self = this,
				views = self.views,
				str = '';
			
			if (newProj){
				str = 'of ' + newProj.get('name');
			}
			
			views.project.pageHeaderTeaser =
					views.schedule.pageHeaderTeaser =
						views.resource.pageHeaderTeaser =
							views.gantt.pageHeaderTeaser = str;
		},
		
		_onEditProjectOverview: function(e){
			this.save('/project/edit');
		},
		
		_onProjectCreateUpdate: function(e){
			this.save('/project/' + e._id);
			
			if (e.type === 'newProjectView:projectUpdated'){
				Y.fire('alert', {
					type: 'success',
					message: 'Project saved successfully',
					preserveOnce: true
				});
			} else if (e.type === 'newProjectView:projectCreated'){
				Y.fire('alert', {
					type: 'success',
					message: 'Project created successfully',
					preserveOnce: true
				});
			}
		},
		
		showScheduleView: function(req, res){
			this.showView('schedule', {
				model: this.get('currentProject')
			});
			this.get('activeView').moveFocusToTable();
		},
		
		showResourceView: function(req, res){
			this.showView('resource', {
				model: this.get('currentProject')
			});
			this.get('activeView').moveFocusToTable();
		},
		
		showGanttView: function(req, res){
			this.showView('gantt', {
				model: this.get('currentProject')
			});
		},
		
		showLoginView: function(){
			if (!this.isAuthenticated){
				this.showView('login');
			} else {
				Y.fire('alert', {
					type: 'error',
					message: 'You are already authenticated. If you typed <strong>/login</strong> in browser then you know what your are doing...'
				});
			}
		},
		
		showNewProjectView: function(req, res){
			this.showView('newproject');
		},
		
		showDashboardView: function(req, res){
			var self = this;
			this.showView('dashboard', {
				model: self.get('currentUser')
			});
		},
		
		handleProject: function(req, res){
			var self = this,
				proj = new Y.Project({
					_id : req.params.id
				});
				
			proj.load(function(err, res){
				if (err){
					Y.fire('alert', {
						type: 'error',
						message: 'Unable to load project. Please try again.'
					});
					return;
				}
				self.set('currentProject', proj);
				self.save('/project/' + req.params.id + '/overview');
			});
		},
		
		showProjectView: function(req, res){
			this.showView('project', {
				model: this.get('currentProject')
			});
		},
		
		showUserView: function(req, res){
			this.showView('usersettings');
		},
		
		showEditProjectView: function(req, res){
			this.showView('newproject', {
				model: this.get('currentProject')
			});
		},
		
		showWorkflowView: function(req, res){
			this.showView('workflow');
		}
		
	}, {
		ATTRS: {
			routes: {
				value: [
					{path: '/project/:id/schedule', callback: 'showScheduleView'},
					{path: '/project/:id/resource', callback: 'showResourceView'},
					{path: '/project/:id/gantt', callback: 'showGanttView'},
					{path: '/login', callback: 'showLoginView'},
					{path: '/', callback: 'showLoginView'},
					{path: '/newproject', callback: 'showNewProjectView'},
					{path: '/dashboard', callback: 'showDashboardView'},
					{path: '/project/:id/edit', callback: 'showEditProjectView'},
					{path: '/project/:id', callback: 'handleProject'},
					{path: '/project/:id/overview', callback: 'showProjectView'},
					{path: '/usersettings', callback: 'showUserView'},
					{path: '/project/:id/workflow', callback: 'showWorkflowView'}
				]
			},
			
			root: {
				value: '/'
			},
			
			currentProject: {
				
			},
			
			currentUser: {
				
			},
			
			isAuthenticated: {
				value: false
			}
		}
	});
});