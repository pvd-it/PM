YUI.add('datatable-tree-body', function(Y) {
	var TreeBodyView,
		YArray = Y.Array,
		YObject = Y.Object;
	
	TreeBodyView = function(){};
	
	TreeBodyView.prototype = {
	    _afterDataChange: function(){
	    	var self = this;
	    	
	    	if (self._renderTimer){
	    		self._renderTimer.cancel();
	    	}
	    	
	    	self._renderTimer = Y.later(200, self, self._throttledRender);
	    },
	    
	    _throttledRender: function(){
	    	this._renderTimer = undefined;
	    	this.render();
	    }
	}
    Y.Base.mix(Y.DataTable.BodyView, [TreeBodyView]);
});
