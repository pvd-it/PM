YUI.add('scroll-snap', function(Y){
	var YArray = Y.Array;
	// A plugin class designed to snap a node on scroll.
	function ScrollSnapPlugin(config) {
    	ScrollSnapPlugin.superclass.constructor.apply(this, arguments);
	}
	
	// Define Static properties NAME (to identify the class) and NS (to identify the namespace)
	ScrollSnapPlugin.NAME = 'scrollSnapPlugin';
	ScrollSnapPlugin.NS = 'ssp';
	
	// Attribute definitions for the plugin
	ScrollSnapPlugin.ATTRS = {
	    scrollOffset: {
	    	value: 0
	    },
	};
	
	// Extend Plugin.Base
	Y.extend(ScrollSnapPlugin, Y.Plugin.Base, {
		initializer: function(config){
			var host = this.get('host'),
				hostY = host.getY();
			
			this.scrollSnapClass = Y.ClassNameManager.getClassName('scroll', 'snap');
			this.evtHandles = [];
			this.evtHandles.push(Y.on('scroll', Y.bind(this._handleWindowScroll, this)));
		},
		
		_handleWindowScroll: function(e){
			var host = this.get('host'),
				docScrollY = host.get('docScrollY'),
				scrollOffset = this.get('scrollOffset'),
				cls = this.scrollSnapClass;
				
			if (docScrollY >= scrollOffset) {
				host.addClass(cls);
				this.fire('scrollSnapped');
			}
			
			if (docScrollY < scrollOffset) {
				host.removeClass(cls);
				this.fire('scrollUnsnapped');
			}
		},
		
		destructor: function(){
			YArray.each(this.evtHandles, function(handle){
				handle.detach();
			});
			this.detach();
		}
	});
	
	Y.ScrollSnapPlugin = ScrollSnapPlugin;
});
