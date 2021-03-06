YUI.add('schedule-view', function(Y){
	var YObject = Y.Object,
		YArray = Y.Array;
	
	Y.namespace('PMApp').ScheduleView = Y.Base.create('scheduleView', Y.View, [], {
		table: null,
		
		initializer: function(){
			
			var me = this,
				resources = me.get('model').get('resources'),
				inlineEditors = {
					'inlineTextEditor': new Y.InlineEditor({
		        		zIndex: 1,
		        		visible: false,
					}),
					'inlineDateEditor': new Y.InlineDateEditor({
		        		zIndex: 1,
		        		visible: false,
					}),
					'inlineResourceEditor': new Y.InlineResourceEditor({
		        		zIndex: 1,
		        		visible: false,
		        		resources: {},
		        		//Introduced to circumvent a bug. When you save project while being on schedule-view and after save is successful,
		        		//add or remove resources to/from tasks, then autocomplete instance was holding the old models (prior to saving),
		        		//so when you do save again, project is not saved properly.
		        		//Because the next save will save the new resource models, however schedule autocomplete had updated old model instances.
		        		//So to make sure, that autocomplete always gets current model, introduced resultListLocator, which using closure always
		        		//gets latest _items from Resource ModelList.
		        		//TODO: Introduce Y.ModelList source type for autocomplete widget
		        		resultListLocator: function(response){
		        			return resources._items;
		        		}
					})
				};
			
			me.inlineEditors = inlineEditors;
				
			me.table = new Y.DataTableSchedule({
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
						inlineEditor: 'inlineTextEditor'					},
					
					//4
					{key: 'work', 				label: 'W',					
						inlineEditor: 'inlineTextEditor',
						partialUpdate: true									},
					
					//5
					{key: 'duration', 			label: 'D',					
					   inlineEditor: 'inlineTextEditor',
					   partialUpdate: true									},
					
					//6
					{key: 'startDate', 			label: 'Start Date',
					   inlineEditor: 'inlineDateEditor',
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
					{key: 'predecessors',		label: 'Depends on',					
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
						editFromNode: true, inlineEditor: 'inlineTextEditor', partialUpdate: true },
																	
					//9
					{
						key: 'resources',	label: 'Resources',
						inlineEditor: 'inlineResourceEditor',
						formatter: function(o){
							o.value = '';
							YArray.each(o.data.resources, function(res){
								o.value += res.get('name') + '; ';
							});
							o.value = o.value.substring(o, o.value.length-2);
						},

						editFunction: function(e, row, eventFacade){
							var taskClientId = row.get('clientId'),
								assignedTasks;
								
							eventFacade.resourcesAdded = e.itemsAdded;
							eventFacade.resourcesRemoved = e.itemsRemoved;
							
							YArray.each(e.itemsAdded, function(res){
								res.assignTask(taskClientId);
							});
							
							YArray.each(e.itemsRemoved, function(res){
								res.unassignTask(taskClientId);
							});
						},
						partialUpdate: true
					},
				],
				recordType: Y.Task,
				data: this.get('model').get('tasks'),
				inlineEditors: inlineEditors,
			});
		},
		
		moveFocusToTable: function(){
			this.table.focus();
		},
		
		render: function(){
			var me = this,
				tableBB;
			
			me.table.render(this.get('container'));
			tableBB = me.table.get('boundingBox');
		},
		
		destructor: function(){
			YObject.each(this.inlineEditors, function(editor){
				editor.destroy();
			});
			
			this.table.destroy();
		}
	});
});
