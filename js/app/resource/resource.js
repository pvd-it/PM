YUI.add('resource', function(Y) {
	Y.Resource = Y.Base.create('resource', Y.Model, [], {
		
		idAttribute: '_id',
		
		initializer: function(config){
			if (config && config.clientId){
				this._set('clientId', config.clientId);	
			} else {
				var generatedId = this.constructor.NAME + '_' +  (++Y.Resource.lastCount);
				this._set('clientId', generatedId);
			}
		},
				
		toJSON: function () {
			var attrs = this.getAttrs();
			
			delete attrs.destroyed;
			delete attrs.initialized;
			
			if (this.idAttribute !== 'id') {
				delete attrs.id;
			}
			
			return attrs;
		},
	}, {
		ATTRS: {
			name: {

			},
		
			startDate: {

			},
		
			endDate: {
		
			},
		
			email: {

			},
			
			cost: {
				
			},
			
			type: {
				
			},
			
			'_id': {
			}
		}	
	});
});
