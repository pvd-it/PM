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
				
			},
			
			ctrlshift: {
				
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
				keyBindings = self.keyBindings,
				kbGroup,
				keyCode = e.keyCode + '',
				fn, beforeFn, afterFn,
				preventDefault = true;
			if (e.ctrlKey && e.shiftKey){
				kbGroup = keyBindings.ctrlshift;
			} else if (e.ctrlKey){
				kbGroup = keyBindings.ctrl;
			} else if (e.shiftKey){
				kbGroup = keyBindings.shift;
			} else {
				kbGroup = keyBindings.plain;
			}

			fn = kbGroup[keyCode];
			beforeFn = kbGroup.beforeFn;
			afterFn = kbGroup.afterFn;
			
			if (beforeFn){
				beforeFn.call(self, e);
			}
			if (fn){
				if (YLang.isObject(fn) && !YLang.isFunction(fn)){
					fn = fn.fn;
					preventDefault = fn.preventDefault;
				}
				Y.log('Invoking identified function');
				fn.call(self, e);
				Y.log('Invoked identified function');
				if (preventDefault){
					e.preventDefault();
				}
			}
			if (afterFn){
				afterFn.call(self, e);
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
