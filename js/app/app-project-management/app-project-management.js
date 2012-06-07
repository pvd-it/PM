YUI.add('app-project-management', function(Y){

	Y.namespace('ProjectManagement');
	Y.ProjectManagement.App = Y.Base.create('appProjectManagement', Y.App, [], {
		views: {
			login:		{type: Y.PMApp.LoginView},
			schedule:	{type: Y.PMApp.ScheduleView, preserve: true, parent: 'login'},
			resource:	{type: Y.PMApp.ResourceView, preserve: true, parent: 'schedule'},
			gantt:		{type: Y.PMApp.GanttView, preserve: false, parent: 'schedule'}
		},
		
		initializer: function(){
			this.after('*:loginSuccess', this.handleLogin);
		},
		
		showLoginView: function(){
			Y.log('login view');
			this.showView('login');
		},
							
		handleLogin: function(e){
			Y.log(e);
			this.replace('/schedule');
		},
		
		handleSchedule: function(req, res, next){
			Y.log('handleSchedule');
			if (this.get('tasks').size() === 0){
				this.get('tasks').loadFromServer(next);	
			} else {
				next();
			}
										
		},
		
		showScheduleView: function(req, res){
			Y.log('showScheduleView');
			this.showView('schedule', {
				modelList: this.get('tasks')
			});
			this.get('activeView').moveFocusToTable();
		},					
		
		handleResource: function(req, res, next){
			Y.log('handleSchedule');
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
		
		handleGantt: function(req, res){
			
		},
		
		showGanttView: function(req, res){
			this.showView('gantt', {
				modelList: this.get('tasks')
			});
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
					{path: '/login', callback: 'showLoginView'}
				]
			},
			
			root: {
				value: '/projectmanagement/' 
			},
			
			tasks: {
				value: new Y.TaskList()
			},
			
			resources: {
				value: new Y.ResourceList()
			}
		}
	});

});
