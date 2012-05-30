YUI.add('schedule-view', function(Y){
	var YObject = Y.Object;
	
	Y.namespace('PMApp').ScheduleView = Y.Base.create('scheduleView', Y.View, [], {
		table: null,
		
		initializer: function(){
			this.table = new Y.DataTableSchedule({
				columns: [
					//1
					{key: 'parent',				label: '#',				
						formatter: function(o){
							o.value = o.rowIndex+1;
						},
																			},
					
					//2
					{key: 'parent',				label: '&nbsp;',
						isTreeKnob: true,									},
						
					//3
					{key: 'name', 				label: 'Task Name',
						isTreeColumn: true,
						inlineEditor: 'InlineEditor'						},
					
					//4
					{key: 'work', 				label: 'W',					
						inlineEditor: 'InlineEditor',
						partialUpdate: true									},
					
					//5
					{key: 'duration', 			label: 'D',					
					   inlineEditor: 'InlineEditor'							},
					
					//6
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
					   partialUpdate: true									},
					
					//7
					{key: 'endDate', 			label: 'End Date',			
						formatter: function(o){
					   		if (Y.Lang.isDate(o.data.endDate)) {
						   		o.value = Y.DataType.Date.format(o.data.endDate, {
						   			format: '%D'
						   		});	
					   		} else {
					   			o.value = '';
					   		}
					   },
					   partialUpdate: true
																			},
					
					//8
					{key: 'predecessors',		label: 'Predecessors',					
						formatter: function(o){
							var data = o.record.lists[0];
							o.value = '';
							
							YObject.each(o.data.predecessors, function(val, key, obj){
								YObject.each(val, function(v, k){
									var i = data.getByClientId(v),
										displayIndex = data.indexOf(i) + 1;
									if (i){
										if (key === 'FS'){
											o.value += displayIndex + '; ';
										}else {
											o.value += displayIndex + key + '; ';
										}
									}
								});
							});
							o.value = o.value.substring(o, o.value.length-2);
						},
						editFromNode: true, inlineEditor: 'InlineEditor', partialUpdate: true },
																	
					//9
					{
						key: 'resources',	label: 'Resources',
						inlineEditor: 'InlineAutoCompleteEditor',
					},
					
					

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
			this.get('container').prepend('<a href="./resource">Resource View</a>' +
											'<a href="./gantt">Gantt View</a>'
										);
		}
	});
});
