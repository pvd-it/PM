/*
 * This is an extension module to app for syncing navigation bars.
 * This should also handle page header display
 */
YUI.add('app-nav', function(Y){
	var Nav;
	
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
						'<li><a href="/help"><i class="icon-bell icon-white"> </i> Help</a></li>' +
						'<li><a href="/usersettings"><i class="icon-user icon-white"> </i> {name}</a></li>' +
					'</ul>',
					
		projectNavTemplate: '<ul class="nav">' +
								'<li class="active">' +
									'<a href="/project/{id}/overview">Overview</a>' +
								'</li>' +
								'<li>' +
									'<a href="/project/{id}/schedule">Schedule</a>' +
								'</li>' +
								'<li>' +
									'<a href="/project/{id}/gantt">Gantt</a>' +
								'</li>' +
								'<li>' +
									'<a href="/project/{id}/resource">Team</a>' +
								'</li>' +
								'<li>' +
									'<a href="/project/{id}/workflow">Workflow</a>' +
								'</li>' +
							'</ul>',
		
		initializer: function(){
			var self = this;
			Y.Do.after(self._setupNav, self, 'render');
			self.after('loginSuccess', Y.bind(self._afterLoginSuccessNav, self));
			self.after('currentProjectChange', self._afterCurrentProjectChangeNav);
			self.after('activeViewChange', self._afterActiveViewChangeNav);
		},
		
		_setupNav: function(){
			var self = this,
				container = self.get('container');
				
			self.pageHeader = Y.one('.page-header');
			self.primaryNav = Y.one('#primaryNav');
			self.secondaryNav = Y.one('.secondary .navbar');

			/**
			 * Do the app nav setup.
			 * If server returns isAuthenticated flag as true, it means the session is already established. This can happen in below cases:
			 * 1. User closed the browser window without logging out and trying to access the application from the same browser session.
			 * 2. User is trying to open the application from another browser tab, after successfully logging into the application from another tab    
			 */
			if (self.get('isAuthenticated')){
				self._setUser(self.get('currentUser'));
				self._setUpViewContainer();
			} else {
				self.primaryNav.one('form').on('submit', self._handleSubmission, self);
			}
		},
		
		_setUpViewContainer: function(){
			Y.one('.main').all('div').remove();
			Y.one('.secondary').removeClass('hide');
			Y.one('body').addClass('checker-body');
		},
		
		_handleSubmission: function(e){
			var form = e.target,
				username = form.one('input[type="text"]').get('value'),
				password = form.one('input[type="password"]').get('value');
			
			e.halt();
			this.doLogin(username, password);
		},
		
		_afterLoginSuccessNav: function(e){
			var self = this;
			self._setUpViewContainer();
			self._setUser(e.user);
		},
		
		_setUser: function(user){
			var self = this;
			Y.one('.main').addClass('container');
			self.primaryNav.one('form').remove();
			self.primaryNav.one('.nav-collapse').set('innerHTML', Y.substitute(self.template, user));			
		},
		
		_afterCurrentProjectChangeNav: function(e){
			var self = this,
				prjId = e.newVal.get('_id');
				
			//Update the secondary nav bar ProjectName dropdown with new project's name
			self.secondaryNav.one('.project-name > a').set('innerHTML', '<i class="icon-gift"> </i> ' + e.newVal.get('name') + ' <b class="caret"></b>');
			
			//Update the secondary nav bar links with new project's id
			self.secondaryNav.one('.project-links').set('innerHTML', Y.substitute(self.projectNavTemplate, {id: prjId}));
		},
		
		_secondaryNavScrollSnapped: function(e){
			this.secondaryNav.addClass('navbar-fixed-top');
			Y.one('.secondary').addClass('scroll-snapped');
		},
		
		_secondaryNavScrollUnsnapped: function(e){
			this.secondaryNav.removeClass('navbar-fixed-top');
			Y.one('.secondary').removeClass('scroll-snapped');
		},
		
		_afterActiveViewChangeNav: function(e){
			var self = this,
				viewInfo = self.getViewInfo(e.newVal),
				path = window.location.pathname,
				prevActiveLink,
				activeLink;
				
			if (viewInfo.subNav){
				self.secondaryNav.removeClass('hide');
				self.secondaryNav.plug(Y.ScrollSnapPlugin, {
					scrollOffset: 70
				});
				self.secondaryNav.ssp.on('scrollSnapped', Y.bind(self._secondaryNavScrollSnapped, self));
				self.secondaryNav.ssp.on('scrollUnsnapped', Y.bind(self._secondaryNavScrollUnsnapped, self));

			} else {
				self.secondaryNav.addClass('hide');
				self.secondaryNav.unplug('ssp');
			}
			
			if(viewInfo.pageHeader){
				self.pageHeader.set('innerHTML', '<h1>' + viewInfo.pageHeader + ' <small>' + viewInfo.pageHeaderTeaser + '</small></h1>');
				self.pageHeader.removeClass('hide');
			} else {
				self.pageHeader.addClass('hide');
			}
			
			//synchronize links, first start with secondary nav bar then move to primary nav
			activeLink = self.secondaryNav.one('a[href="' + window.location.pathname + ']');
			if (activeLink){
				prevActiveLink = self.secondaryNav.one('.active');
				prevActiveLink && prevActiveLink.removeClass('active');
				activeLink.get('parentNode').addClass('active');
				return;
			}
			activeLink = self.primaryNav.one('a[href="' + window.location.pathname + ']');
			if (activeLink){
				prevActiveLink = self.primaryNav.one('.active');
				prevActiveLink && prevActiveLink.removeClass('active');
				activeLink.get('parentNode').addClass('active');
			}
		},
	};
});
