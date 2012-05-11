YUI.add('task', function(Y) {
	Y.Task = Y.Base.create('task', Y.TreeModel, [], {
		initializer: function(config){
			if (config && config.clientId){
				this._set('clientId', config.clientId);	
			} else {
				var generatedId = this.constructor.NAME + '_' +  (++Y.Task.lastCount);
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
		
			isFixedDuration: {
				value: false
			},
		
			work: {
				value: 8
			},
			
			duration: {
				value: 1
			},
			
			parentTask: {
				
			},
			
			clientId: {
				valueFn: undefined
			}
		}	
	});
});
