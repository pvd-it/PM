YUI.add('datatable-tree-body', function(Y) {
	var TreeBodyView;
	
	TreeBodyView = function(){};
	
	TreeBodyView.prototype = {
		_afterDataChange: function (e) {
	        if(e.type.indexOf('change') > 0 && e.src === 'UI'){
	        	this.render();
	        } else {
	        	this.render();
	        }
	    },	
	}
    
    Y.Base.mix(Y.DataTable.BodyView, [TreeBodyView]);
});
