YUI.add('resource', function(Y) {
	var YArray = Y.Array;

	Y.Resource = Y.Base.create('resource', Y.Model, [], {

		idAttribute: '_id',

		initializer: function(config){
			if (config && config.clientId){
				this._set('clientId', config.clientId);
			} else {
				var generatedId = this.constructor.NAME + '_' +  (++Y.Resource.lastCount);
				this._set('clientId', generatedId);
			}

			if (config && config.assignedTasks){
				this._set('assignedTasks', config.assignedTasks);
			} else {
				this._set('assignedTasks', []);
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

		assignTask: function(taskId){
			var self = this,
				tasks = new YArray(self.get('assignedTasks'));

			tasks.push(taskId);
			self.set('assignedTasks', tasks);
		},

		unassignTask: function(taskId){
			var self = this,
				tasks = new YArray(self.get('assignedTasks')),
				index = YArray.indexOf(tasks, taskId);

			YArray.remove(tasks, index);
			self.set('assignedTasks', tasks);
		}
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
			},

			assignedTasks: {
			}
		}
	});
});
