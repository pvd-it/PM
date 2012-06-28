YUI.add('model-fix', function(Y) {
	var YLang = Y.Lang;
		
	Y.ModelFix = Y.Base.create('modelFix', Y.Model, [], {
		isNew: function () {
			var self = this,
				idAttr = this.idAttribute;
				
			if (!idAttr){
				idAttr = 'id';
			}
        	return !YLang.isValue(self.get(idAttr));
    	},
	});
});
