YUI.add('project', function(Y){
	Y.Project = Y.Base.create('project', Y.Model, [], {
		
		initializer: function(config){
		},
		
		sync: function(action, options, callback){
			var actionFn = this[action],
				iocfg = {
					on: {
						success: function(tid, response) {
							callback(null, response.responseText);
						},
						failure: function(tid, response){
							callback(response.statusText);
						},
					}
				};
			actionFn && actionFn.call(this, iocfg);
		},
		
		create: function(iocfg){
			
			iocfg.method = 'POST';
			iocfg.headers = {
				'Content-Type': 'application/json',
			};
			iocfg.data = Y.JSON.stringify(this.toJSON());
			
			Y.io('/data/project/create', iocfg);
		},
		
		read: function(iocfg){
			iocfg.method = 'GET';
			Y.io('/data/project/' + this.get('_id'), iocfg);
		},
		
		update: function(iocfg){
			iocfg.method = 'POST';
			iocfg.headers = {
				'Content-Type': 'application/json',
			};
			iocfg.data = Y.JSON.stringify(this.toJSON()),
			
			Y.io('/data/project/update', iocfg);
		},
		
		'delete': function(iocfg){
			iocfg.method = 'DELETE';
			Y.io('/data/project/' + this.get('_id'), iocfg);
		}
		
	}, {
		name: {},
		organization: {},
		tasks: {},
		team: {},
		businessNeed: {},
		businessRequirement: {},
		businessValue: {},
		constraints: {},
		idAttribute: {
			value: '_id'
		}
	});
});
