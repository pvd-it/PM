YUI.add('project-calendar', function(Y){
	var ProjectCalendar,
		YObject = Y.Object,
		YDate = Y.DataType.Date;
			
	ProjectCalendar = function() {
		this.data = {
		};
	};
	
	ProjectCalendar.prototype = {

		_getDateAsKey: function(date){
			return YDate.format(date, {format: '%Y%m%d'});
		},
		
		getNextWorkDay: function(date, resource) {
			var me = this,
				isWD;
			
			do {
				date = YDate.addDays(date, 1);
				isWD = me.isWorkDay(date);
			} while (!isWD);
			
			return date;
		},
		
		isWorkDay: function(date) {
			var weekDay = date.getDay(),
				me = this,
				index;
				
			//Check if date falls in weekends
			index = me.WEEKENDS.indexOf(weekDay);
			
			if (index < 0) { //Date is not weekend
				var strDate = me._getDateAsKey(date),
					holidays = me.HOLIDAYS || [];
				
				return (holidays.indexOf(strDate) < 0);
			} else { //Date is weekend, so can't be workday
				return false;
			}
		},
		
		calProjectSchedule: function(){
			
		},
		
		calcTaskEndDateWithResourceFromScratch: function(task){
			var taskId = task.get('clientId'),
				taskWork = task.get('work'),
				taskStartDate = task.get('startDate'),
				resources = task.get('resources'),
				resource = resources && resources[0],
				resourceId = resource ? resource.get('clientId'): undefined,
				me = this,
				calDate,
				resourceAlloc,
				assignedWork,
				hoursRemainingForDay;
			
			/**
			 *	1. See if there is entry for this task's start date.
			 */
			while (true){
				
				startDateKey = me._getDateAsKey(taskStartDate);
				
				calDate = me.data[startDateKey];					//See if this particular date is already present in ProjectCalendar
				if (!calDate){
					me.data[startDateKey] = calDate = {};			//Date is not present, make an entry in ProjectCalendar
				}

				if(resourceId){										//See if some resource is allocated for the task or not
					resourceAlloc = calDate[resourceId];			//Check if assigned resource has some work on given date
					if (!resourceAlloc){
						resourceAlloc = calDate[resourceId] = {};	//Resource doesn't have work for a given date, so create it
						hoursRemainingForDay = me.MAX_HOURS_PER_DAY;//and assign full capacity
					} else {
						var totalHours = 0;
						YObject.each(resourceAlloc, function(v){	//Resource already has work for given date,
																		//now check how many hours are remaining for him for a given date
							totalHours = totalHours + v;
						});
						hoursRemainingForDay = me.MAX_HOURS_PER_DAY - totalHours;
					}
				} else {
					hoursRemainingForDay = me.MAX_HOURS_PER_DAY;	//Since no resource, so do maximum amount of work
					resourceAlloc = {};								//Create dummy obj, so that further code doesn't break
				}
				
				assignedWork = me._calculateWork(taskWork, hoursRemainingForDay);	//Calculate assigned work
				
				if (assignedWork > 0){
					resourceAlloc[taskId] = assignedWork;			//Book that work for resource under a given task id,
																	//only if assigned work is greater than zero
					taskWork = taskWork - assignedWork;
				}
				
				if (taskWork > 0){
					taskStartDate = me.getNextWorkDay(taskStartDate);
				} else {
					break;
				}
			}
			
			task.set('endDate', taskStartDate, {silent: true});
			return taskStartDate;
		},
		
		_calculateWork: function(remainingTaskEffort, availableHoursToResourceForDay){
			if (remainingTaskEffort <= availableHoursToResourceForDay){
				return remainingTaskEffort;
			}
			return availableHoursToResourceForDay;
		},
		
		MAX_HOURS_PER_DAY: 8,
		
		WEEKENDS: [0, 6] //0 being Sunday and 6 being Saturday
	
	};
	
	Y.ProjectCalendar = new ProjectCalendar();

/**
 *This is how the data property of ProjectCalendar will be maintained, per resource/task and per task/resource basis
 *
	{
		'2012-05-18': {
			ResA: {
				'task_1': 4,
				'task_2': 4
			},
			
			ResB: {
			},
	
			'task_1': {
				'ResA': 4
			}
		}
	}
*/
});