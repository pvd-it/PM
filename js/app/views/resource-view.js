YUI.add('resource-view', function(Y){
	var YObject = Y.Object;
	
	Y.namespace('PMApp').ResourceView = Y.Base.create('resourceView', Y.View, [], {
		table: null,
		
		initializer: function(){
			var inlineEditors = {
				'inlineTextEditor': new Y.InlineEditor({
	        		zIndex: 1,
	        		visible: false,
				}),
				'inlineDateEditor': new Y.InlineDateEditor({
	        		zIndex: 1,
	        		visible: false,
				}),
			};
			
			this.inlineEditors = inlineEditors;
			this.table = new Y.DataTable({
				columns: [
					{key: 'name',				label: 'Index',				
						formatter: function(o){
							o.value = o.rowIndex+1;
						}													},
					{key: 'name', 				label: 'Resource Name',
							inlineEditor: 'inlineTextEditor',
							partialUpdate: true								},
					{key: 'email', 				label: 'Email Address',
							inlineEditor: 'inlineTextEditor',
							partialUpdate: true								},
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
							partialUpdate: true								},
					{key: 'endDate', 			label: 'End Date',
							inlineEditor: 'inlineDateEditor',
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
				data: this.get('model').get('resources'),
				inlineEditors: inlineEditors,
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
					Y.log(this.get('model').get('resources').toJSON());
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
		},
		
		destructor: function(){
			YObject.each(this.inlineEditors, function(editor){
				editor.destroy();
			});
			this.table.destroy();
		}
	});
});
