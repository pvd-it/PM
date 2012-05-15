YUI.add('task', function(Y) {
	var YLang = Y.Lang,
		YArray = Y.Array;
		
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
			},
			
			predecessors: {
				setter: function(val) {
					var list = this.lists[0],
						preTasks = [];
					
					if(YLang.isString(val)){
						val = val.trim();
						
						if (val.length > 0){
							var tokens = val.split(';');
							YArray.each(tokens, function(token){
								token = token.trim();
								
								var itemIndex = parseInt(token),
									item = list.item(itemIndex),
									pred = {};
								
								if (item){
									var itemIndexStr = itemIndex + '';
									if (itemIndexStr === token){
										pred.type = 'FS';
									} else {
										pred.type =  token.substring(itemIndexStr.length);
									}
									pred.task = item.get('clientId');
									preTasks.push(pred);
								}
							});
							
							return new Y.ArrayList(preTasks);	
						
						} else {
							return new Y.ArrayList();
						}
							
					} else if (YLang.isArray(val)){
						return new Y.ArrayList(val);
					}
				}
			},
			
			successors: {
			}
		}	
	});
});
