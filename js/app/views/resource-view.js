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
					{key: 'name', 				label: 'Resource Name'		},
					{key: 'email', 				label: 'Email Address'		},
					{key: 'startDate', 			label: 'Start Date'			},
					{key: 'endDate', 			label: 'End Date'			}
				],
				caption: 'Resources',
				recordType: Y.Resource,
				data: this.get('modelList')
			});
		},
		
		events: {
			'.save': {
				click: function(e){
					this.get('modelList').persistList();
				}
			},
			
			'.print': {
				click: function(e){
					Y.log(this.get('modelList')._clientIdMap);
				}
			}
		},
		
		moveFocusToTable: function(){
			this.table.focus();
		},
		
		render: function(){
			this.get('container').append('<a href="./schedule">Schedule</a>');
			this.get('container').append('<div>' +
											'<button class="save">Save</button>' + 
											'<button class="print">Print</button>' +
										'</div>');
			this.table.render(this.get('container'));
		}
	});
});
