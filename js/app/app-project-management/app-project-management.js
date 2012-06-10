YUI.add('app-project-management', function(Y){
	var App, 
	getClassName = Y.ClassNameManager.getClassName;
	
	Y.namespace('ProjectManagement');
	
	Y.ProjectManagement.App = App = Y.Base.create('appProjectManagement', Y.App, [], {
		views: {
			login:		{type: Y.PMApp.LoginView},
			logout:		{type: Y.PMApp.LogoutView},
			schedule:	{type: Y.PMApp.ScheduleView, preserve: true, parent: 'login'},
			resource:	{type: Y.PMApp.ResourceView, preserve: true, parent: 'schedule'},
			gantt:		{type: Y.PMApp.GanttView, preserve: false, parent: 'schedule'}
		},
		
		initializer: function(){
			this.after('*:loginSuccess', this._afterLoginSuccess);
			this.after('*:logoutSuccess', this._afterLogoutSuccess);
			
			this.after('alert:closed', this._afterAlertClosed);
			Y.on('alert', Y.bind(this._afterAlertReceived, this));	
			/*
			Y.on('scroll', function(e){
				Y.log('scrolled');
				Y.log(Y.DOM.docScrollY());
			});*/
		},
		
		render: function(){
			App.superclass.render.apply(this, arguments);
			
			this._renderLoginbar();
			this._renderAlertBoard();
		},
		
		_renderLoginbar: function(){
			var loginbar = Y.one('.' + getClassName('app', 'loginbar'));
			this.loginbar = loginbar;
			
			var lis = loginbar.all('li').remove();
			this.loginNode = lis.item(0);
			this.logoutNode = lis.item(1);
		},
		
		_renderAlertBoard: function(){
			var alertBoard = Y.one('.' + getClassName('app', 'alert', 'board'));
			this.alertBoard = alertBoard;
		},

		_afterAlertReceived: function(e){
			var alert = new Y.Alert({
				type: e.type,
				message: e.message
			});
			//Make yourself target of alert, so that you can listen to closed event
			alert.addTarget(this);
			alert.render(this.alertBoard);
			this.alertBoard.scrollIntoView();
		},
		
		_afterAlertClosed: function(e){
			e.target.destroy();
		},
		
		_afterLoginSuccess: function(e){
			this.loginNode.remove();
			this.loginbar.append(this.logoutNode);
			this.isAuthenticated = true;
			this.replace('/schedule');
		},
		
		_afterLogoutSuccess: function(e){
			this.reset();
		},
		
		reset: function(){
			this.logoutNode.remove();
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
		}
		
	}, {
		ATTRS: {
			routes: {
				value: [
					{path: '/schedule', callback: 'handleSchedule'},
					{path: '/schedule', callback: 'showScheduleView'},
					{path: '/resource', callback: 'handleResource'},
					{path: '/resource', callback: 'showResourceView'},
					{path: '/gantt', callback: 'showGanttView'},
					{path: '/login', callback: 'showLoginView'},
					{path: '/logout', callback: 'showLogoutView'}
				]
			},
			
			root: {
				value: '/' 
			},
			
			tasks: {
			},
			
			resources: {
			}
		}
	});
});