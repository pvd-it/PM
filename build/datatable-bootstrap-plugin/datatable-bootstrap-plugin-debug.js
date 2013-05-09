/**
Adds bootstrap css classes to datatable widget
@module datatable-bootstrap-plugin
@class DataTableBootstrapPlugin
*/
YUI.add('datatable-bootstrap-plugin', function(Y){
	function DataTableBootstrapPlugin() {
		DataTableBootstrapPlugin.superclass.constructor.apply(this, arguments);
	}
	
	DataTableBootstrapPlugin.NAME = 'dataTableBootstrapPlugin';
	DataTableBootstrapPlugin.NS = 'bs';
	
	Y.extend(DataTableBootstrapPlugin, Y.Plugin.Base, {
		/**
		@method initializer
		@param {Object} config
		@example config object

		{
			"striped": true,
			"bordered": true,
			"hover": true,
			"condensed": true	
		}

		*/
		initializer: function(config){
			this.config = config;
			this.afterHostEvent('render', this._addBootstrapClasses);
		},
		
		destructor: function(){
			this._removeBootstrapClasses();
		},
		
		/**
		Adds the bootstrap classes to table node (invoked after render event of widget)
		@method _addBootstrapClasses
		@private
		*/
		_addBootstrapClasses: function(){
			var self = this,
				tableNode = self.get('host').get('boundingBox').one('table'),
				config = self.config;
			
			tableNode.addClass('table'); //Always add this class
			
			config.striped && tableNode.addClass('table-striped');
			config.bordered && tableNode.addClass('table-bordered');
			config.hover && tableNode.addClass('table-hover');
			config.condensed && tableNode.addClass('table-condensed');
			
			self.tableNode = tableNode;
		},
		
		/**
		Removes the bootstrap classes on unplug (invoked from destructor)
		@method _removeBootstrapClasses
		@private
		*/
		_removeBootstrapClasses: function(){
			var tableNode = this.tableNode,
				config = this.config;
			
			if (tableNode){
				tableNode.removeClass('table');
				config.striped && tableNode.removeClass('table-striped');
				config.bordered && tableNode.removeClass('table-bordered');
				config.hover && tableNode.removeClass('table-hover');
				config.condensed && tableNode.removeClass('table-condensed');
			}
		}
	});
	
	Y.namespace('Plugin').DataTableBootstrap = DataTableBootstrapPlugin;
});
