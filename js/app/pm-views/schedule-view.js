YUI.add('schedule-view', function(Y){
	Y.namespace('PMApp').ScheduleView = Y.Base.create('scheduleView', Y.View, [], {
		table: null,
		
		initializer: function(){
			this.table = new Y.DataTableTree({
				columns: [
					//1
					{key: 'parent',				label: '#',				
						formatter: function(o){
							o.value = o.rowIndex+1;
						},
						editFromNode: true									},
					
					//2
					{key: 'parent',				label: '&nbsp;',
						isTreeKnob: true,		editFromNode: true			},
						
					//3
					{key: 'name', 				label: 'Task Name',
					 	isTreeColumn: true,									},
					
					//4
					{key: 'work', 				label: 'W'					},
					
					//5
					{key: 'duration', 			label: 'D'					},
					
					//6
					{key: 'startDate', 			label: 'Start Date'			},
					
					//7
					{key: 'endDate', 			label: 'End Date'			},
					
					//8
					{key: 'predecessors',		label: 'Predecessors',					
						formatter: function(o){
							var data = this.get('data');
							o.value = '';
							o.data.predecessors && o.data.predecessors.each && o.data.predecessors.each(function(item, index){
								var i = data.getByClientId(item.task);
								o.value += data.indexOf(i) + item.type + '; ';
							});
							o.value = o.value.substring(o, o.value.length-2);
						},
						editFromNode: true									}
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
