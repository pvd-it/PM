YUI.add('resource-view', function(Y){
	Y.namespace('PMApp').ResourceView = Y.Base.create('resourceView', Y.View, [], {
		table: null,
		
		initializer: function(){
			this.table = new Y.DataTable({
				columns: [
					{key: 'name',				label: 'Index',				
						formatter: function(o){
							o.value = o.rowIndex+1;
						}													},
					{key: 'name', 				label: 'Resource Name',
							inlineEditor: 'InlineEditor',
							partialUpdate: true								},
					{key: 'email', 				label: 'Email Address',
							inlineEditor: 'InlineEditor',
							partialUpdate: true								},
					{key: 'startDate', 			label: 'Start Date',
							inlineEditor: 'InlineDateEditor',
							formatter: function(o){
						   		if (Y.Lang.isDate(o.data.startDate)) {
							   		o.value = Y.DataType.Date.format(o.data.startDate, {
							   			format: '%D'
							   		});	
						   		} else {
						   			o.value = '';
						   		}
					   		},
							partialUpdate: true								},
					{key: 'endDate', 			label: 'End Date',
							inlineEditor: 'InlineDateEditor',
							formatter: function(o){
						   		if (Y.Lang.isDate(o.data.endDate)) {
							   		o.value = Y.DataType.Date.format(o.data.endDate, {
							   			format: '%D'
							   		});	
						   		} else {
						   			o.value = '';
						   		}
					   		},
							partialUpdate: true								}
				],
				caption: 'Resources',
				recordType: Y.Resource,
				data: this.get('model').get('team')
			});
		},
		
		events: {
			'.save': {
				click: function(e){
					this.get('model').save(function(err, response){
							if (err){
								Y.fire('alert', {
									type: 'error',
									message: 'Some error occured while saving the project. Server returned: ' + err
								});
							}
							else {
								Y.fire('alert', {
									type: 'success',
									message: 'Project saved successfullly'
								});
							}
					});
				}
			},
			
			'.print': {
				click: function(e){
					Y.log(this.get('model').get('team').toJSON());
				}
			}
		},
		
		moveFocusToTable: function(){
			this.table.focus();
		},
		
		render: function(){
			this.get('container').append('<div>' +
											'<button class="save">Save</button>' + 
											'<button class="print">Print</button>' +
										'</div>');
			this.table.render(this.get('container'));
		}
	});
});
