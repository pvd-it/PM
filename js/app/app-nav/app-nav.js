YUI.add('app-nav', function(Y){
	
	Y.namespace('PMApp').Nav = Nav = function() {};

	Nav.prototype =	{
		
		template: 	'<ul class="nav">' +
						'<li><a href="/dashboard">Dashboard</a></li>' + 
						'<li><a href="/newproject">New Project</a></li>' +
					'</ul>' +
					'<form method="GET" action="/logout" class="pull-right navbar-form">' +
						'<button class="btn btn-danger"><i class="icon-white icon-share"></i> Logout</button>' + 
					'</form>' +
					'<ul class="nav pull-right">' + 
						'<li><a href="/usersettings"><i class="icon-user icon-white"> </i> {name}</a></li>' +
					'</ul>',
		
		initializer: function(){
			var self = this;
			Y.Do.after(self._setupNav, self, 'render');
			Y.after('loginSuccess', Y.bind(self._afterLoginSuccessNav, self));
			self.after('currentProjectChange', self._afterCurrentProjectChangeNav);
			self.after('activeViewChange', self._afterActiveViewChangeNav);
		},
		
		_setupNav: function(){
			var self = this;
			self.primaryNav = Y.one('#primaryNav');
			self.secondaryNav = Y.one('#secondaryNav');
			
			if (self.get('isAuthenticated')){
				self._setUser(self.get('currentUser'));
				Y.one('.main').all('div').remove();
			} else {
				self.primaryNav.one('form').on('submit', self._handleSubmission, self);
			}
		},
		
		_handleSubmission: function(e){
			var form = e.target,
				username = form.one('input[type="text"]').get('value'),
				password = form.one('input[type="password"]').get('value');
			
			e.halt();
			
			Y.PMApp.Login.doLogin(username, password);
		},
		
		_afterLoginSuccessNav: function(e){
			this._setUser(e.user);
		},
		
		_setUser: function(user){
			var self = this;
			
			Y.one('.main').addClass('container');
			self.primaryNav.one('form').remove();
			self.primaryNav.one('.nav-collapse').set('innerHTML', Y.substitute(self.template, user));			
		},
		
		_afterCurrentProjectChangeNav: function(e){
			this.secondaryNav.one('.project-name').set('innerHTML', e.newVal.get('name') + ' <b class="caret"></b>');
		},
		
		_afterActiveViewChangeNav: function(e){
		},
	};
});