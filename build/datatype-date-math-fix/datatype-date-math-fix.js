YUI.add('datatype-date-math-fix', function(Y) {

/**
 * Datatype Date Math submodule.
 *
 * @module datatype
 * @submodule datatype-date-math
 * @for DataType.Date
 */
	//	summary:
	//		Get the difference in a specific unit of time (e.g., number of
	//		months, weeks, days, etc.) between two dates, rounded to the
	//		nearest integer.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//		Defaults to "day".
	Y.mix(Y.namespace("DataType.Date"), {
		difference: function(/*Date*/date1, /*Date?*/date2, /*String?*/interval){
			date2 = date2 || new Date();
			interval = interval || "day";
			var yearDiff = date2.getFullYear() - date1.getFullYear(),
				delta = 1; // Integer return value
		
			switch(interval){
				case "quarter":
					var m1 = date1.getMonth(),
						m2 = date2.getMonth(),
					// Figure out which quarter the months are in
						q1 = Math.floor(m1/3) + 1,
						q2 = Math.floor(m2/3) + 1;
					// Add quarters for any year difference between the dates
					q2 += (yearDiff * 4);
					delta = q2 - q1;
					break;
				case "weekday":
					var days = Math.round(dojo.date.difference(date1, date2, "day")),
						weeks = parseInt(dojo.date.difference(date1, date2, "week"), 10),
						mod = days % 7;
		
					// Even number of weeks
					if(mod === 0){
						days = weeks*5;
					}else{
						// Weeks plus spare change (< 7 days)
						var adj = 0,
							aDay = date1.getDay(),
							bDay = date2.getDay();
		
						weeks = parseInt(days/7, 10);
						mod = days % 7;
						// Mark the date advanced by the number of
						// round weeks (may be zero)
						var dtMark = new Date(date1);
						dtMark.setDate(dtMark.getDate()+(weeks*7));
						var dayMark = dtMark.getDay();
		
						// Spare change days -- 6 or less
						if(days > 0){
							switch(true){
								// Range starts on Sat
								case aDay === 6:
									adj = -1;
									break;
								// Range starts on Sun
								case aDay === 0:
									adj = 0;
									break;
								// Range ends on Sat
								case bDay === 6:
									adj = -1;
									break;
								// Range ends on Sun
								case bDay === 0:
									adj = -2;
									break;
								// Range contains weekend
								case (dayMark + mod) > 5:
									adj = -2;
							}
						}else if(days < 0){
							switch(true){
								// Range starts on Sat
								case aDay === 6:
									adj = 0;
									break;
								// Range starts on Sun
								case aDay === 0:
									adj = 1;
									break;
								// Range ends on Sat
								case bDay === 6:
									adj = 2;
									break;
								// Range ends on Sun
								case bDay === 0:
									adj = 1;
									break;
								// Range contains weekend
								case (dayMark + mod) < 0:
									adj = 2;
							}
						}
						days += adj;
						days -= (weeks*2);
					}
					delta = days;
					break;
				case "year":
					delta = yearDiff;
					break;
				case "month":
					delta = (date2.getMonth() - date1.getMonth()) + (yearDiff * 12);
					break;
				case "week":
					// Truncate instead of rounding
					// Don't use Math.floor -- value may be negative
					delta = parseInt(dojo.date.difference(date1, date2, "day")/7, 10);
					break;
				case "day":
					delta /= 24;
					// fallthrough
				case "hour":
					delta /= 60;
					// fallthrough
				case "minute":
					delta /= 60;
					// fallthrough
				case "second":
					delta /= 1000;
					// fallthrough
				case "millisecond":
					delta *= date2.getTime() - date1.getTime();
			}
		
			// Round for fractional values and DST leaps
			return Math.round(delta); // Number (integer)
		}
	});
});