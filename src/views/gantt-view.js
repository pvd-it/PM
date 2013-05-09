YUI.add('gantt-view', function(Y){
	var YObject = Y.Object,
		YArray = Y.Array,
		YLang = Y.Lang;
	
	Y.namespace('PMApp').GanttView = Y.Base.create('ganttView', Y.View, [], {
		
		initializer: function(){
			this.template = Y.Handlebars.template(Y.HandlebarsTemplates['t-gantt']);		
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
					dayWidth = 27,
					difference = 0,
					elapsedDays = 0,
					currentTaskStartDate = task.get('startDate'),
					currentTaskEndDate = task.get('endDate');
				
				difference = Y.DataType.Date.difference(startDate, currentTaskStartDate);
				taskJson.startShift = (difference * dayWidth);
				
				difference = Y.DataType.Date.difference(currentTaskStartDate, currentTaskEndDate);
				taskJson.barWidth = ((difference + 1) * dayWidth);
				
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
							days: days,
							dayCount: days.length
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
				days: days,
				dayCount: days.length
			});
			
			templateData = {
				tasks: tasks,
				months: months
			};
			
			content = this.template(templateData);
			
			var container = this.get('container');
			container.setContent(content);
			
			var	headerScrollview = new Y.ScrollView({
					id: 'header-scrollview',
					srcNode: container.one('#header-scrollview-content'),
					width: '970px',
					axis: 'x'
				}),
				bodyScrollview = new Y.ScrollView({
					id : "body-scrollview",
					srcNode : container.one('#body-scrollview-content'),
					width : '970px',
					axis : 'x'
				});
					
			//This will ensure that both scrollviews are in sync
			headerScrollview['_flick'] = bodyScrollview['_flick'] = function(){
				Y.ScrollView.prototype['_flick'].apply(bodyScrollview, arguments);
				Y.ScrollView.prototype['_flick'].apply(headerScrollview, arguments);
			};
			headerScrollview['_onGestureMoveEnd'] = bodyScrollview['_onGestureMoveEnd'] = function(){
				Y.ScrollView.prototype['_onGestureMoveEnd'].apply(bodyScrollview, arguments);
				Y.ScrollView.prototype['_onGestureMoveEnd'].apply(headerScrollview, arguments);
			};
			headerScrollview['_onGestureMove'] = bodyScrollview['_onGestureMove'] = function(){
				Y.ScrollView.prototype['_onGestureMove'].apply(bodyScrollview, arguments);
				Y.ScrollView.prototype['_onGestureMove'].apply(headerScrollview, arguments);
			};
			headerScrollview['_onGestureMoveStart'] = bodyScrollview['_onGestureMoveStart'] = function(){
				Y.ScrollView.prototype['_onGestureMoveStart'].apply(bodyScrollview, arguments);
				Y.ScrollView.prototype['_onGestureMoveStart'].apply(headerScrollview, arguments);
			};
				
			bodyScrollview.render(container.one('.movable-body'));
			headerScrollview.plug(Y.Plugin.ScrollViewScrollbars);
			headerScrollview.render(container.one('.fixable-header'));
			
			var spreadsheetTable = container.one('.spreadsheet-table');
			spreadsheetTable.plug(Y.ScrollSnapPlugin, {
				scrollOffset: 70
			});
			spreadsheetTable.ssp.on('scrollSnapped', function(e){
				this.get('host').addClass('scroll-snapped');
			});
			spreadsheetTable.ssp.on('scrollUnsnapped', function(e){
				this.get('host').removeClass('scroll-snapped');
			});
			return this;
		}
	});
});
