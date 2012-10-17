YUI.add('app-project-management', function(Y){
	var App, 
	getClassName = Y.ClassNameManager.getClassName,
	YArray = Y.Array;
	
	Y.namespace('ProjectManagement');
	
	Y.ProjectManagement.App = App = Y.Base.create('appProjectManagement', Y.App, [Y.App.Dropdown, Y.PMApp.Nav, Y.PMApp.Login, Y.AppBaseFix], {
		views: {
			login:		{type: Y.PMApp.LoginView, preserve: false},
			logout:		{type: Y.PMApp.LogoutView, preserve: false, pageHeader: 'Logout', pageHeaderTeaser: ' is successful, so you are'},
			project:	{type: Y.PMApp.ProjectView, preserve: false, pageHeader: 'Overview', pageHeaderTeaser: '', subNav: true},
			schedule:	{type: Y.PMApp.ScheduleView, preserve: false, parent: 'login', pageHeader: 'Schedule', pageHeaderTeaser: '', subNav: true},
			resource:	{type: Y.PMApp.ResourceView, preserve: false, parent: 'schedule', pageHeader: 'Team', pageHeaderTeaser: '', subNav: true},
			gantt:		{type: Y.PMApp.GanttView, preserve: false, parent: 'schedule', pageHeader: 'Gantt', pageHeaderTeaser: '', subNav: true},
			newproject: {type: Y.PMApp.NewProjectView, preserve: false, pageHeader: 'Create a Project', pageHeaderTeaser: 'to manage it better'},
			dashboard: 	{type: Y.PMApp.DashboardView, preserve: false, pageHeader: 'Dashboard', 
																	pageHeaderTeaser: 'is where you see all your projects, tasks and notifications'},
			usersettings: {type: Y.PMApp.UserSettingsView, preserve: true, pageHeader: 'Personalize', pageHeaderTeaser: 'to your own preferences'}
		},
		
		initializer: function(){
			this.after('loginSuccess', this._afterLoginSuccess);
			
			this.after('alert:closed', this._afterAlertClosed);
			Y.on('alert', Y.bind(this._afterAlertReceived, this));
			
			this.after('currentUserChange', this._afterCurrentUserChange);
			this.after('currentProjectChange', this._afterCurrentProjectChange);
			
			this.on('*:editProjectOverview', this._onEditProjectOverview);
			this.on('*:projectCreated', this._onProjectCreateUpdate);
			this.on('*:projectUpdated', this._onProjectCreateUpdate);
			
			this.alertArray = [];
		},

		showView: function(view){
			var self = this,
				pageHeaderText = self.views[view] && self.views[view].pageHeader,
				pageHeaderTeaserText = self.views[view] && self.views[view].pageHeaderTeaser,
				navAnchor;
			
			if (pageHeaderText){
				var str = '<h1>' + pageHeaderText + ' ';
				if (pageHeaderTeaserText) {
					str = str + '<small>' + pageHeaderTeaserText + '</small>';
				}
				str = str + '</h1>';
				//this.pageHeader.set('innerHTML', str);
			}
			
			if (self.views[view].subNav) {
				//this._showSubNav();
			} else {
				//this._hideSubNav();
			}
			Y.AppBaseFix.prototype.showView.apply(this, arguments);
		},
		
		render: function(){
			App.superclass.render.apply(this, arguments);
			Y.log('App render');
			this._renderAlertBoard();
		},
		
		_renderAlertBoard: function(){
			var alertBoard = Y.one('.' + getClassName('app', 'alert', 'board'));
			this.alertBoard = alertBoard;
		},
		
		_subNavSnapped: function(e){
			var prjName = this.get('currentProject').get('name');
			this.subNavbar.rightText.setContent(prjName);
		},
		
		_subNavUnsnapped: function(e){
			this.subNavbar.rightText.setContent('');
		},
		
		/**
		 * whenever a new view comes up remove all alert messages...
		 * TODO: Instead of doing alert message cleanup in catchAll, better to hook to activeViewChange event 
		 */
		_handleCatchAll: function(req, res, next){
			Y.log('handle catch all');
			YArray.each(this.alertArray, function(alertWidget){
				if (alertWidget.preserveOnce){
					delete alertWidget.preserveOnce;
				} else {
					alertWidget.close(true);
				}
			}, this);
			next && next();
		},

		_afterAlertReceived: function(e){
			var alert = new Y.Alert({
				type: e.type,
				message: e.message
			});
			
			alert.preserveOnce = e.preserveOnce;
			this.alertArray.push(alert);
			//Make yourself target of alert, so that you can listen to closed event
			alert.addTarget(this);
			alert.render(this.alertBoard);
			this.alertBoard.scrollIntoView();
		},
		
		/**
		 * Handle alert close event
		 */
		_afterAlertClosed: function(e){
			Y.log('App alter close notification');
			var index = YArray.indexOf(this.alertArray, e.target);
			if (index >=0){
				YArray.remove(this.alertArray, index);
			}
			e.target.destroy();
		},
		
		_afterLoginSuccess: function(e){
			Y.log('after login success');
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
		
		handleSchedule: function(req, res, next){
			/*if (this.get('tasks').size() === 0){
				this.get('tasks').loadFromServer(next);	
			} else {
				next();
			}*/
			next();
		},
		
		showScheduleView: function(req, res){
			this.showView('schedule', {
				model: this.get('currentProject')
			});
			this.get('activeView').moveFocusToTable();
		},					
		
		handleResource: function(req, res, next){
			/*if (this.get('resources').size() === 0){
				this.get('resources').loadFromServer(next);
				Y.namespace('Project').Resources = this.get('resources');
			} else {
				next();
			}*/
			next();
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
		
		showLogoutView: function(req, res){
			this.showView('logout');
			this.get('activeView').doLogout();
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
		
		handleProject: function(req, res, next){
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
				next();
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
		}
		
	}, {
		ATTRS: {
			routes: {
				value: [
//					{path: '/*', callback: '_handleCatchAll'},
					{path: '/schedule', callback: 'handleSchedule'},
					{path: '/schedule', callback: 'showScheduleView'},
					{path: '/resource', callback: 'handleResource'},
					{path: '/resource', callback: 'showResourceView'},
					{path: '/gantt', callback: 'showGanttView'},
					{path: '/login', callback: 'showLoginView'},
					{path: '/', callback: 'showLoginView'},
					{path: '/logout', callback: 'showLoginView'},
					{path: '/newproject', callback: 'showNewProjectView'},
					{path: '/dashboard', callback: 'showDashboardView'},
					{path: '/project', callback: 'showProjectView'},
					{path: '/project/edit', callback: 'showEditProjectView'},
					{path: '/project/:id', callback: 'handleProject'},
					{path: '/project/:id', callback: 'showProjectView'},
					{path: '/usersettings', callback: 'showUserView'}
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