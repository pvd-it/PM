YUI.add('resource-list', function(Y) {
	Y.ResourceList = Y.Base.create('resourceList', Y.ModelList, [], {
		
		model: Y.Resource,
		
		initializer: function(){
		
		},
		
		persistList: function(){
			var uri = '/data/resources',
				cfg = {
					method: 'POST',
					headers: {
				        'Content-Type': 'application/json',
				    },
					data: Y.JSON.stringify({
						resources: this.toJSON(),
						lastCount: Y.Resource.lastCount
						}),
					on: {
						start: function(transactionId, arguments){
							Y.log('Saving....');
						},
						
						complete: function(transactionId, response, arguments){
							Y.log('Done....');
						},
						
						success: function(transactionId, response, arguments){
							Y.log('Saved successfully');
						},
						
						failure: function(transactionId, response, arguments){
							Y.log('Failure: ' + response.statusText);
							Y.log('Failure: ' + response.status);
						},
						
						end: function(transactionId, arguments){
							
						}
					}
				};
				
			Y.io(uri, cfg);
		},
		
		loadFromServer: function(successFn){
			var uri = '/data/resources',
				cfg = {
					method: 'GET',
					on: {
						start: function(transactionId, arguments){
							Y.log('Loading....');
						},
						
						complete: function(transactionId, response, arguments){
							Y.log('Done....');
						},
						
						success: function(transactionId, response, arguments){
							var res = Y.JSON.parse(response.responseText);
							Y.Resource.lastCount = res.lastCount;
							arguments.modellist.reset(res.resources);
							successFn();
						},
						
						failure: function(transactionId, response, arguments){
							Y.log('Failure: ' + response.statusText);
							Y.log('Failure: ' + response.status);
							Y.log('Error loading data...');
						},
						
						end: function(transactionId, arguments){
							
						}
					},
					/*
					xdr: {use: 'native', dataType: 'text'} ,
					*/
					arguments: {modellist: this}
				};
			Y.io(uri, cfg, this);
		}
	});
});
