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
				dataDropdownCategory,
				dataDropdownAction,
				dataActionConfirmation;
							
			if (self._lastActiveDropdown) {
				self._closeDropdown();
				dropDownMenu = self._lastActiveDropdown.next();
				if (dropDownMenu.contains(target)) {
					dataDropdownCategory = dropDownMenu.getAttribute('data-dropdown-category');
					dataDropdownAction = target.getAttribute('data-dropdown-action');
					dataActionConfirmation = target.getAttribute('data-action-confirmation');
					Y.fire(dataDropdownCategory + ':appAction', {
						action: dataDropdownAction,
						confirmationRequired: dataActionConfirmation === 'true' ? true : false,
						category: dataDropdownCategory
					});
				}
			}
			
			if (target.hasClass('dropdown-toggle') || (target.hasClass('caret') && target.get('parentNode').hasClass('dropdown-toggle'))){
				target =  target.hasClass('caret') ? target.get('parentNode'): target;
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