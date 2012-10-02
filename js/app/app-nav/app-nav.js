YUI.add('app-nav', function(Y){
	
	Y.namespace('PMApp').NavView = Y.Base.create('navView', Y.View, [], {
		
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
			Y.after('*:activeViewChange', Y.bind(self._afterActiveViewChange, self));
			Y.after('loginSuccess', Y.bind(self._afterLoginSuccess, self));
		},
		
		render: function(){
			var self = this,
				container = self.get('container');
			
			self.primaryNav = Y.one('#primaryNav');
			self.secondaryNav = Y.one('#secondaryNav');
			
			return self;
		},
		
		events: {
			'form': {
				'submit': 'handleSubmission'
			}
		},

		handleSubmission: function(e){
			var form = e.target,
				username = form.one('input[type="text"]').get('value'),
				password = form.one('input[type="password"]').get('value');
			
			e.halt();
			
			Y.PMApp.Login.doLogin(username, password);
		},
		
		_afterLoginSuccess: function(e){
			var self = this,
				user = e.user;
			
			Y.one('.main').addClass('container');
			self.primaryNav.one('form').remove();
			self.primaryNav.one('.nav-collapse').set('innerHTML', Y.substitute(self.template, user));
		},
		
		_afterActiveViewChange: function(e){
			Y.log(e);
		}
	});
});