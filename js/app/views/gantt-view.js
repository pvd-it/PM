YUI.add('gantt-view', function(Y){
	var YObject = Y.Object,
		YArray = Y.Array,
		YLang = Y.Lang;
	
	Y.namespace('PMApp').GanttView = Y.Base.create('ganttView', Y.View, [], {
		
		template: Y.Handlebars.compile(Y.one('#t-gantt').getContent()),
		
		initializer: function(){
		
		},
		
		render: function(){
			var tasksList = this.get('model').get('tasks'),
				tasks = [],
				templateData,
				months = [],
				days,
				calData = Y.ProjectCalendar.data,
				dates = YObject.keys(calData),
				prevMonth,
				month,
				datesInMonth,
				content,
				monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				startDate = tasksList.item(0).get('startDate'),
				endDate = tasksList.item(0).get('endDate');
				
			tasksList.each(function(task){
				var taskJson = task.toJSON(),
					dayWidth = 19,
					difference = 0,
					elapsedDays = 0,
					currentTaskStartDate = task.get('startDate'),
					currentTaskEndDate = task.get('endDate');
				
				difference = Y.DataType.Date.difference(startDate, currentTaskStartDate);
				taskJson.startShift = (difference * 15);
				
				difference = Y.DataType.Date.difference(currentTaskStartDate, currentTaskEndDate);
				taskJson.barWidth = ((difference + 1) * 15) + 1;
				
				taskJson.isParent = taskJson.children.size() > 0;
				
				tasks.push(taskJson);
			});
			
			var d = startDate;
			while (Y.DataType.Date.isGreaterOrEqual(endDate, d)){
				var dayInMonth,
					isWeekend = false,
					isHoliday = false,
					cssClass = ['day'],
					vaar;
					
				month = d.getMonth();
				dayInMonth = d.getDate();
				vaar = d.getDay();
				
				if (dayInMonth < 10){
					dayInMonth = '0'+dayInMonth;
				}
				
				if (vaar === 0 || vaar === 6){
					isWeekend = true;
					cssClass.push('weekend');
				}
				
				if (prevMonth !== month){
					if (!YLang.isUndefined(prevMonth)){
						var colMonth = {
							name: monthNames[prevMonth],
							days: days
						};
						months.push(colMonth);
					}
					prevMonth = month;
					days = [];
				}
				days.push({
					dayInMonth: dayInMonth,
					isWeekend: isWeekend,
					isHoliday: isHoliday,
					dayName: dayNames[vaar],
					cssClass: cssClass.join(' ')
				});
				
				d = Y.DataType.Date.addDays(d, 1);
			}
			
			months.push({
				name: monthNames[prevMonth],
				days: days
			});
			
			templateData = {
				tasks: tasks,
				months: months
			};
			
			content = this.template(templateData);
			
			this.get('container').setContent(content);
			
			return this;
		}
	});
});
