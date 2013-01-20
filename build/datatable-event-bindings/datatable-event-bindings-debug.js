/**
Sets stage for dom event registrations for datatable-* modules
@module datatable-event-bindings
@class DataTable.EventBindings
*/
YUI.add('datatable-event-bindings', function(Y){
	var EventBindings,
		YLang = Y.Lang;
	
	Y.namespace('DataTable').EventBindings = EventBindings = function(){};
	
	EventBindings.prototype = {
		initializer: function(){
			Y.Do.after(this._afterBindUIEventBindings, this, 'bindUI');
		},
		
		_afterBindUIEventBindings: function(){
			Y.log('Y.DataTable.EventBindings._afterBindUIEventBindings');
			
			var self = this;
			Y.Object.each(self.eventRegisterFns, function(val, key, obj){
				val.apply(self);
			});
		},
		
		/**
		Object literal containing functions to be invoked during bindUI phase.
		@property eventRegisterFns
		@type Object
		*/
		eventRegisterFns: {
			key: function(){
				var me = this;
				me.delegate('key', me._keyHandler, 'down:', null, me);
			},
			
			mousedown: function(){
				var me = this;
				me.on('mousedown', me._mouseDownHandler);
			}
		},
		
		/**
		Object literal containing functions to be invoked when a particular key is pressed.
		@property keyBindings
		@type Object
		*/
		keyBindings: {
			ctrl: {
				
			},
			
			shift: {
				
			},
			
			alt: {
				
			},
			
			plain: {
				
			}
		},
		
		/**
		Uses a generic object keys to handle keyboard events
		@method _keyHandler
		@private
		*/
		_keyHandler: function(e){
			Y.log('Y.DataTable.EventBindings._keyHandler ctrl:' + e.ctrlKey +
					' shift:' + e.shiftKey +
					' alt:' + e.altKey +
					' keyCode:' + e.keyCode +
					' charCode:' + e.charCode);
			
			var self = this,
				keyCode = e.keyCode + '',
				fn,
				preventDefault = true;
			
			if (e.ctrlKey){
				fn = self.keyBindings.ctrl[keyCode];
			} else if (e.shiftKey){
				fn = self.keyBindings.shift[keyCode];
			} else {
				fn = self.keyBindings.plain[keyCode];
			}
			
			if (fn){
				if (YLang.isObject(fn) && !YLang.isFunction(fn)){
					fn = fn.fn;
					preventDefault = fn.preventDefault;
				}
				fn.call(self, e);
				if (preventDefault){
					e.preventDefault();
				}
			}
		},
		
		/**
		Sets the focus to the datatable
		@method _mouseDownHandler
		@private
		*/
		_mouseDownHandler: function(e){
			Y.log('Y.DataTable.EventBindings._mouseDownHandler');
			
			this.focus();
		}
	};
});
