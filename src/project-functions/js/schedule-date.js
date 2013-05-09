YUI.add('schedule-date', function(Y) {
	Y.mix(Y.namespace('PM.ScheduleDate'), {
		startTime: {
			hour: 9,
			minute: 0
		},
		
		endTime: {
			hour: 18,
			minute: 30
		},
		
		breakDuration: 1,
		
		setDate: function(date){
			date.setHours(this.startTime.hour);
			date.setMinutes(this.startTime.minute);
			date.setSeconds(0);
		},
		
		getNextBusinessDate: function(date){
			var daysToAdd = 1,
				day = date.getDay();
				
			if (date.getHours() > this.endTime.hour) {
				if (day === 5){
					daysToAdd = 3;
				} else if (day === 6) {
					daysToAdd = 2;
				}
				Y.DataType.Date.addDays(date,daysToAdd);
			}
		},
		
		getWorkingHoursPerDay: Y.cached(Y.bind(function(){
			Y.log('called...');
			var workingMins = (this.endTime.hour * 60 + this.endTime.minute) - (this.startTime.hour * 60 + this.startTime.minute) - (this.breakDuration * 60),
				hours = Math.floor(workingMins/60),
				mins = workingMins%60;
			
			return {
				hour: hours,
				minute: mins,
				totalMins: workingMins
			};
		},Y.PM.ScheduleDate)),
		
		getDurationFromEffort: function(effort){
			var workingMins = this.getWorkingHoursPerDay().totalMins,
				effortMins = effort * 60;
			
			return {
				day: Math.floor(effortMins / workingMins),
				hour: (effortMins % workingMins)/60,
				totalMins: workingMins
			}
		}
	});
});