YUI.add('schedule-view', function(Y){
	Y.namespace('PMApp').ScheduleView = Y.Base.create('scheduleView', Y.View, [], {
		table: null,
		
		initializer: function(){
			this.table = new Y.DataTableTree({
				columns: [
					{key: 'parent',				label: 'Index',				
						formatter: function(o){
							o.value = o.rowIndex+1;
						}													},
					{key: 'parent',				label: 'T',
						isTreeKnob: true,
																			},	
					{key: 'name', 				label: 'Task Name',
					 	isTreeColumn: true,
																			},
					{key: 'work', 				label: 'W'					},
					{key: 'duration', 			label: 'D'					},
					{key: 'startDate', 			label: 'Start Date'			},
					{key: 'endDate', 			label: 'End Date'			},
					{key: 'isFixedDuration',	label: 'Fixed Duration'		}
				],
				caption: 'Project Schedule',
				recordType: Y.Task,
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
			this.table.render(this.get('container'));
			this.get('container').append('<div>' +
											'<button class="save">Save</button>' + 
											'<button class="print">Print</button>' +
										'</div>');
			this.get('container').prepend('<a href="./resource">Resource View</a>');
		}
	});
});
