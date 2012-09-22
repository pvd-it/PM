YUI.add('model-list-variance', function(Y) {
	
	var YArray = Y.Array;
	
	function ModelListVariance(config){}
	
	ModelListVariance.prototype = {
		serialize: function () {
	        var newItems = [],
	        	modifiedItems = [],
	        	deletedItems = this.deletedItems,
	        	model;
	        
	        YArray.each(this._items, function(item, index){
	        	model = (item.serialize) ? item.serialize() : item.toJSON();
	        	
	        	if (item.isNew()) {
	        		newItems.push(model);
	        	} else if (item.isModified() || model.position !== index) {
	        		modifiedItems.push(model);
	        	}
	        	model.position = index;
	        }, this);
	        
	        return {newItems: newItems, modifiedItems: modifiedItems, deletedItems: deletedItems};
    	},
	};
	
	Y.ModelListVariance = ModelListVariance;
});