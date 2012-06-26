YUI.add('app-project-management', function(Y){
	var App, 
	getClassName = Y.ClassNameManager.getClassName,
	YArray = Y.Array;
	
	Y.namespace('ProjectManagement');
	
	Y.ProjectManagement.App = App = Y.Base.create('appProjectManagement', Y.App, [], {
		views: {
			login:		{type: Y.PMApp.LoginView, pageHeader: 'Login', pageHeaderTeaser: 'to access your projects'},
			logout:		{type: Y.PMApp.LogoutView, pageHeader: 'Logout', pageHeaderTeaser: ' is successful, so you are'},
			project:	{type: Y.PMApp.ProjectView, preserve: true, pageHeader: 'Overview', pageHeaderTeaser: '', subNav: true},
			schedule:	{type: Y.PMApp.ScheduleView, preserve: true, parent: 'login', pageHeader: 'Schedule', pageHeaderTeaser: '', subNav: true},
			resource:	{type: Y.PMApp.ResourceView, preserve: true, parent: 'schedule', pageHeader: 'Team', pageHeaderTeaser: '', subNav: true},
			gantt:		{type: Y.PMApp.GanttView, preserve: false, parent: 'schedule', pageHeader: 'Gantt', pageHeaderTeaser: '', subNav: true},
			newproject: {type: Y.PMApp.NewProjectView, preserve: false, pageHeader: 'Create a Project', pageHeaderTeaser: 'to manage it better'},
			dashboard: 	{type: Y.PMApp.DashboardView, preserve: false, pageHeader: 'Dashboard', pageHeaderTeaser: 'is where you see all your projects, tasks and notifications'},
			usersettings: {type: Y.PMApp.UserSettingsView, preserve: true, pageHeader: 'Personalize', pageHeaderTeaser: 'to your own preferences'}
		},
		
		initializer: function(){
			this.after('*:loginSuccess', this._afterLoginSuccess);
			this.after('*:logoutSuccess', this._afterLogoutSuccess);
			
			this.after('alert:closed', this._afterAlertClosed);
			Y.on('alert', Y.bind(this._afterAlertReceived, this));
			
			this.after('currentUserChange', this._afterCurrentUserChange);
			this.after('currentProjectChange', this._afterCurrentProjectChange);
			
			this.after('navigate', this._afterPjaxNavigate);
			
			this.alertArray = [];	
			/*
			Y.on('scroll', function(e){
				Y.log('scrolled');
				Y.log(Y.DOM.docScrollY());
			});*/
		},
		
		showView: function(view){
			var self = this,
				pageHeaderText = self.views[view] && self.views[view].pageHeader,
				pageHeaderTeaserText = self.views[view] && self.views[view].pageHeaderTeaser;
			
			if (pageHeaderText){
				var str = '<h1>' + pageHeaderText + ' ';
				if (pageHeaderTeaserText) {
					str = str + '<small>' + pageHeaderTeaserText + '</small>';
				}
				str = str + '</h1>';
				this.pageHeader.set('innerHTML', str);
			}
			
			if (self.views[view].subNav) {
				this.subNavbar.setStyle('display', 'block');
			} else {
				this.subNavbar.setStyle('display', 'none');
			}
			
			App.superclass.showView.apply(this, arguments);
		},
		
		render: function(){
			App.superclass.render.apply(this, arguments);
			
			this._renderLoginbar();
			this._renderAlertBoard();
			this._renderSubNavbar();
			this._renderPageHeader();
		},
		
		_renderLoginbar: function(){
			var loginbar = Y.one('.' + getClassName('app', 'loginbar'));
			this.loginbar = loginbar;
			
			var lis = loginbar.all('li').remove();
			this.userNode = lis.item(0);
			this.loginNode = lis.item(1);
			this.logoutNode = lis.item(2);
		},
		
		_renderAlertBoard: function(){
			var alertBoard = Y.one('.' + getClassName('app', 'alert', 'board'));
			this.alertBoard = alertBoard;
		},
		
		_renderSubNavbar: function(){
			var subNavbar = Y.one('.' + getClassName('app', 'sub', 'navbar'));
			subNavbar.setStyle('display', 'none');
			this.subNavbar = subNavbar;
		},
		
		_renderPageHeader: function(){
			var pageHeader = Y.one('.' + getClassName('app', 'page', 'header'));
			this.pageHeader = pageHeader;
		},
		
		
		/**
		 * whenever a new view comes up remove all alert messages...
		 */
		_handleCatchAll: function(req, res, next){
			YArray.each(this.alertArray, function(alertWidget){
				alertWidget.close(true);
			}, this);
			next && next();
		},

		_afterAlertReceived: function(e){
			var alert = new Y.Alert({
				type: e.type,
				message: e.message
			});
			
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
			this.set('currentUser', e.user);
			this.replace('/dashboard');
			//this.subNavbar.setStyle('display', 'block');
		},
		
		_afterLogoutSuccess: function(e){
			this.reset();
		},
		
		_afterCurrentUserChange: function(e){
			this._uiSetCurrentUser(e.newVal);
		},
		
		_uiSetCurrentUser: function(user){
			this.loginNode.remove();
			this.userNode.one('a').set('innerHTML', 'Welcome, ' + user.name);
			this.loginbar.append(this.userNode);
			this.loginbar.append(this.logoutNode);
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
		
		_afterPjaxNavigate: function(e){
			var self = this;
			
			if (self.lastActiveNav){
				self.lastActiveNav.removeClass('active');
			}
			self.lastActiveNav = e.originEvent.target.get('parentNode');
			self.lastActiveNav.addClass('active');
		},
		
		reset: function(){
			this.logoutNode.remove();
			this.userNode.remove();
			this.loginbar.append(this.loginNode);
			this.isAuthenticated = false;
			this.set('tasks', new Y.TaskList());
			this.set('resources', new Y.ResourceList());
		},
		
		handleSchedule: function(req, res, next){
			if (this.get('tasks').size() === 0){
				this.get('tasks').loadFromServer(next);	
			} else {
				next();
			}
		},
		
		showScheduleView: function(req, res){
			this.showView('schedule', {
				modelList: this.get('tasks')
			});
			this.get('activeView').moveFocusToTable();
		},					
		
		handleResource: function(req, res, next){
			if (this.get('resources').size() === 0){
				this.get('resources').loadFromServer(next);
				Y.namespace('Project').Resources = this.get('resources');
			} else {
				next();
			}
		},
		
		showResourceView: function(req, res){
			Y.log('showResourceView');
			this.showView('resource', {
				modelList: this.get('resources')
			});
			this.get('activeView').moveFocusToTable();
		},
		
		showGanttView: function(req, res){
			this.showView('gantt', {
				modelList: this.get('tasks')
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
					_id: req.params.id
				});
				
			proj.load(function(err, res){
				if (err){
					Y.fire('alert', {
						type: 'error',
						message: 'Unable to load project. Please try again.'
					});
				} else {
					self.set('currentProject', proj);
					next();
				}
			})
		},
		
		showProjectView: function(req, res){
			this.showView('project', {
				model: this.get('currentProject')
			});
		},
		
		showUserView: function(req, res){
			this.showView('usersettings');
		}
		
	}, {
		ATTRS: {
			routes: {
				value: [
					{path: '/*', callback: '_handleCatchAll'},
					{path: '/schedule', callback: 'handleSchedule'},
					{path: '/schedule', callback: 'showScheduleView'},
					{path: '/resource', callback: 'handleResource'},
					{path: '/resource', callback: 'showResourceView'},
					{path: '/gantt', callback: 'showGanttView'},
					{path: '/login', callback: 'showLoginView'},
					{path: '/logout', callback: 'showLogoutView'},
					{path: '/newproject', callback: 'showNewProjectView'},
					{path: '/dashboard', callback: 'showDashboardView'},
					{path: '/project/:id', callback: 'handleProject'},
					{path: '/project/:id', callback: 'showProjectView'},
					{path: '/user', callback: 'showUserView'}
				]
			},
			
			root: {
				value: '/' 
			},
			
			tasks: {
			},
			
			resources: {
			},
			
			currentProject: {
				
			},
			
			currentUser: {
				
			}
		}
	});
});