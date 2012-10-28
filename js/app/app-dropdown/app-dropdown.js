YUI.add('app-dropdown', function(Y){
	/**
	 * This is an extension class to be mixed with Y.App class, so that dropdowns across the app are handled.
	 * This allows efficient event handling using delegation
	 */
	var Dropdown;
	
	Y.namespace('App').Dropdown = Dropdown = function() {};
	
	Dropdown.prototype = {
		initializer: function(){
			var self = this;
			Y.Do.after(self._setupDropdown, self, 'render');
		},
		
		_setupDropdown: function(){
			var self = this,
				container = self.get('container');
				
			container.on('click', Y.bind(self._handleClickDropdown, self));
		},
		
		_handleClickDropdown: function(e){
			var self = this,
				target = e.target,
				dropDownMenu,
				dataDropdown,
				dataDropdownAction,
				handler;
			
			if (self._lastActiveDropdown) {
				self._closeDropdown();
				dropDownMenu = self._lastActiveDropdown.next();
				if (dropDownMenu.contains(target)) {
					dataDropdown = dropDownMenu.getAttribute('data-dropdown');
					dataDropdownAction = target.getAttribute('data-dropdown-action');
					Y.fire(dataDropdown + ':' + dataDropdownAction);
				}
			}
			
			if (target.hasClass('dropdown-toggle')){
				if (self._lastActiveDropdown !== target){
					self._lastActiveDropdown = target;
					self._openDropdown();
				} else {
					self._lastActiveDropdown = null;
				}
				e.halt();
			} else {
				self._lastActiveDropdown = null;
			}
		},
		
		_closeDropdown: function(){
			this._lastActiveDropdown.get('parentNode').removeClass('open');
		},
		
		_openDropdown: function(){
			this._lastActiveDropdown.get('parentNode').addClass('open');
		}
	};
});