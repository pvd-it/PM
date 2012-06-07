YUI.add('datatable-tree-body', function(Y) {
	var TreeBodyView,
		YArray = Y.Array,
		YObject = Y.Object;
	
	TreeBodyView = function(){};
	
	TreeBodyView.prototype = {
		_afterDataChange: function (e) {
			
	        if(e.type.indexOf(':change') > 0 ){
	        	var data = this.get('modelList'),
	        		task = e.target,
	        		rowIndex = data.indexOf(task),
	        		columns = this.columns;
	        	
	        	YObject.some(e.changed, function(v, k){
	        		var colIndex = this._findColByKey(columns,k),
	        			col = columns[colIndex],
	        			tdCell = this.getCell([rowIndex, colIndex]);
	        		
	        		if(col && col.partialUpdate === true){
	        			if (col.formatter){
		        			var formatterData = {
				                    value    : '',
				                    data     : task.toJSON(),
				                    column   : col,
				                    record   : task,
				                    className: '',
				                    rowClass : '',
				                    rowIndex : rowIndex
			                	};
			                
			                col.formatter.call(this, formatterData);
			                tdCell.setContent(formatterData.value);
		        		} else {
		        			tdCell.setContent(v.newVal);
		        		}
	        		} else {
	        			this.render();
	        			return true;
	        		}
	        	}, this);
	        } else {
	        	this.render();
	        }
	    },
	    
	    _findColByKey: Y.cached(function(columns, key){
	    	var selColIndex;
	    	YArray.some(columns, function(col, index){
	    		if (col.key === key){
	    			selColIndex = index;
	    			return true;
	    		}
	    	});
	    	return selColIndex;
	    }, this),
	}
    Y.Base.mix(Y.DataTable.BodyView, [TreeBodyView]);
});
