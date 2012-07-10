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
					   inlineEditor: 'InlineEditor',
					   partialUpdate: true									},
					
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
						inlineEditor: 'InlineResourceEditor',
					},
					
					

				],
				recordType: Y.Task,
				data: this.get('model').get('tasks')
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
					Y.log(Y.JSON.stringify(this.get('model').toJSON()));
				}
			}
		},
		
		moveFocusToTable: function(){
			this.table.focus();
		},
		
		render: function(){
			this.table.render(this.get('container'));
			this.get('container').prepend('<div>' +
											'<button class="save">Save</button>' + 
											'<button class="print">Print</button>' +
										'</div>');
		}
	});
});
