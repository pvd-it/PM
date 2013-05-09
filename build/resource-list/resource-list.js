YUI.add('resource-list', function(Y) {
	Y.ResourceList = Y.Base.create('resourceList', Y.ModelList, [Y.ModelListVariance], {

		model: Y.Resource,

		deletedItems: [],

		initializer: function(){
			this.on('remove', this._removeInterceptor);
		},

		_removeInterceptor: function(e){
			this.deletedItems.push(e.model.toJSON());
		}
	});
});
