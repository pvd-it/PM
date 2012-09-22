YUI.add('project-calendar-tests', function(Y) {

    var ASSERT = Y.Assert,
        ARRAYASSERT = Y.ArrayAssert,
        YDate = Y.DataType.Date,
        YJSON = Y.JSON,
	    suite = new Y.Test.Suite("ProjectCalendar"),
    	aTestCase;
    	
	aTestCase = new Y.Test.Case({	//Test if a given date is workday
        name: 'Work Days',
        
        projCal: new Y.ProjectCalendar(),
        
        setUp: function(){
        	//Ensure default value at beginning of every test
        	this.projCal.WEEKENDS = [0, 6];
        },
	
	    //---------------------------------------------
	    // Tests
	    //---------------------------------------------
		testIsWorkDayDefault: function(){
			var testDate = new Date(),
				me = this,
				result;
			
			testDate.setFullYear(2012, 8, 4); //4-Sep-2012 Tuesday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is a work day, so value should be true');
			
			testDate.setFullYear(2012, 8, 2); //2-Sep-2012 Sunday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result === false, 'Date is Sunday, so value should be false');
			
			testDate.setFullYear(2012, 8, 1); //1-Sep-2012 Saturday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result === false, 'Date is Saturday, so value should be false');
			
		},
		
		testWorkDayCustomWeekends: function(){
			var testDate = new Date(),
				me = this,
				result;
				
			me.projCal.WEEKENDS = [2, 4]; // Let's make Tuesday (2) and Thursday (4) as non working days in week
			
			testDate.setFullYear(2012, 8, 4); //4-Sep-2012 Tuesday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result === false, 'Date is Tuesday, so value should be false');
			
			testDate.setFullYear(2012, 8, 13); //13-Sep-2012 Thursday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result === false, 'Date is Thursday, so value should be false');
			
			testDate.setFullYear(2012, 8, 17); //17-Sep-2012 Monday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is Monday, so value should be true');
			
			testDate.setFullYear(2012, 8, 23); //23-Sep-2012 Sunday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is Sunday, and as per our definition it should be workday, so value should be true');
		},
		
		testWorkDayNoWeekends: function(){
			var testDate = new Date(),
				me = this,
				result;
				
			me.projCal.WEEKENDS = [];
			
			testDate.setFullYear(2012, 8, 4); //4-Sep-2012 Tuesday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is Tuesday, so value should be true');
			
			testDate.setFullYear(2012, 8, 13); //13-Sep-2012 Thursday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is Thursday, so value should be true');
			
			testDate.setFullYear(2012, 8, 17); //17-Sep-2012 Monday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is Monday, so value should be true');
			
			testDate.setFullYear(2012, 8, 23); //23-Sep-2012 Sunday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is Sunday, and as per our definition it should be workday, so value should be true');
		},

		testWorkDayHolidays: function(){
			var testDate = new Date(),
				me = this,
				result;
				
			me.projCal.HOLIDAYS = ['20120919', '20120928'];
			
			testDate.setFullYear(2012, 8, 19) //19-Sep-2012 Wednesday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result === false, 'Date is a holiday, so result should be false');
			
			testDate.setFullYear(2012, 8, 22) //22-Sep-2012 Wednesday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result === false, 'Date is a weekend, so result should be false');
			
			testDate.setFullYear(2012, 8, 25) //25-Sep-2012 Tuesday
			result = me.projCal.isWorkDay(testDate);
			Y.assert(result, 'Date is a workday, so result should be true');
		}
	});
    suite.add(aTestCase);
    
    aTestCase = new Y.Test.Case({	//Test finding next workday
        name: 'Find Work Days',
        
        projCal: new Y.ProjectCalendar(),
        
        setUp: function(){
        	//Ensure default value at beginning of every test
        	this.projCal.WEEKENDS = [0, 6];
        	this.projCal.HOLIDAYS = ['20121225', '20130101'];
        },
        
        testGetNextWorkDayAfterHoliday: function(){
        	var testDate = new Date(),
        		resultDate,
				me = this,
				result;
				
			testDate.setFullYear(2012, 11, 24); //24-Dec-2012
			resultDate = me.projCal.getNextWorkDay(testDate);
			Y.assert(resultDate.getFullYear() === 2012, 'Year should be 2012');
			Y.assert(resultDate.getMonth() === 11, 'Month should be 11 (i.e. December)');
			Y.assert(resultDate.getDate() === 26, 'Date should be 26');
			
			
			testDate.setFullYear(2012, 11, 31); //31-Dec-2012
			resultDate = me.projCal.getNextWorkDay(testDate);
			Y.assert(resultDate.getFullYear() === 2013, 'Year should be 2013');
			Y.assert(resultDate.getMonth() === 0, 'Month should be 0 (i.e. January)');
			Y.assert(resultDate.getDate() === 02, 'Date should be 02');
        },
        
        testGetNextWorkDayAfterWeekend: function(){
        	var testDate = new Date(),
        		resultDate,
				me = this,
				result;
				
			testDate.setFullYear(2012, 8, 7); //07-Sep-2012 Friday
			resultDate = me.projCal.getNextWorkDay(testDate);
			Y.assert(resultDate.getFullYear() === 2012, 'Year should be 2012');
			Y.assert(resultDate.getMonth() === 8, 'Month should be 8 (i.e. September)');
			Y.assert(resultDate.getDate() === 10, 'Date should be 10');
        },
        
        testGetNextWorkDayAferCustomWeekendHoliday: function(){
        	var testDate = new Date(),
        		resultDate,
				me = this,
				result;
				
			me.projCal.WEEKENDS = [4,5]; //Thursday and Friday
			me.projCal.HOLIDAYS = ['20120908'];
			
			testDate.setFullYear(2012, 8, 5); //05-Sep-2012
			resultDate = me.projCal.getNextWorkDay(testDate);
			Y.assert(resultDate.getFullYear() === 2012, 'Year should be 2012');
			Y.assert(resultDate.getMonth() === 8, 'Month should be 8 (i.e. September)');
			Y.assert(resultDate.getDate() === 9, 'Date should be 10');
        }
    });
    suite.add(aTestCase);

	aTestCase = new Y.Test.Case({	//Test work allocation for a resource and/or task
		name: 'Allocate work',
		
		projCal: new Y.ProjectCalendar(),
		
		setUp: function(){
        	//Ensure default value at beginning of every test
        	this.projCal.WEEKENDS = [0, 6];
        	this.projCal.data = {};
        },
        
        testCalcTaskEndDateForResourceFromScratch: function(){
        	var task = new Y.Task({
        			startDate: '2012-09-05T00:00:00.000Z',
        			work: 40,
        			clientId: 'testTask1',
        		}),
        		resource = new Y.Resource({
        			clientId: 'testResource1'
        		}),
        		resultDate,
        		resultDateString,
        		me = this;
        		
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task, resource);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	
        	ASSERT.areSame("20120911", resultDateString);
        	
        	Y.log(Y.JSON.stringify(me.projCal.data));
        },
        
        testCalcTaskEndDateForResourceFull: function(){
        	var task = new Y.Task({
        			startDate: '2012-09-12T00:00:00.000Z',
        			work: 28,
        			clientId: 'testTask1',
        		}),
        		resource = new Y.Resource({
        			clientId: 'testResource1'
        		}),
        		resultDate,
        		resultDateString,
        		me = this;
        		
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task, resource);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	
        	ASSERT.areSame("20120917", resultDateString);
        	
        	task = new Y.Task({
        		startDate: resultDate,
        		work: 12,
        		clientId: 'testTask2',
        	});
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task, resource);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	
        	ASSERT.areSame('20120918', resultDateString);
        	
        	Y.log(Y.JSON.stringify(me.projCal.data));
        },
        
        testCalTaskEndDateNoResourceAdjacentStartEnd: function(){
        	var task = new Y.Task({
        			startDate: '2012-09-12T00:00:00.000Z',
        			work: 28,
        			clientId: 'testTask4',
        		}),
        		resultDate,
        		resultDateString,
        		me = this;
        		
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	ASSERT.areSame("20120917", resultDateString);
        	
        	task = new Y.Task({
        		startDate: resultDate,
        		work: 8,
        		clientId: 'testTask5',
        	});
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	ASSERT.areSame('20120917', resultDateString);
        	
        	Y.log(Y.JSON.stringify(me.projCal.data));
        },
        
        testCalTaskEndDateNoResourceSameStartDate: function(){
        	var task = new Y.Task({
        			startDate: '2012-09-12T00:00:00.000Z',
        			work: 28,
        			clientId: 'testTask1',
        		}),
        		resultDate,
        		resultDateString,
        		me = this;
        		
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	ASSERT.areSame("20120917", resultDateString);
        	
        	task = new Y.Task({
        		startDate: '2012-09-12T00:00:00.000Z',
        		work: 24,
        		clientId: 'testTask1',
        	});
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	ASSERT.areSame('20120914', resultDateString);
        	
        	Y.log(Y.JSON.stringify(me.projCal.data));
        },
        
        testCalTaskEndDateSameResourceSameStartDate: function(){
        	var task = new Y.Task({
        			startDate: '2012-09-12T00:00:00.000Z',
        			work: 28,
        			clientId: 'testTask1',
        		}),
        		resource = new Y.Resource({
        			clientId: 'testResource1'
        		}),
        		resultDate,
        		resultDateString,
        		me = this;
        	
        	me.projCal.data = {};
        	
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task, resource);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	ASSERT.areSame('20120917', resultDateString);
        	
        	task = new Y.Task({
				startDate: '2012-09-12T00:00:00.000Z',
				work: 28,
				clientId: 'testTask2',
        	});
        	resultDate = me.projCal.calcTaskEndDateWithResourceFromScratch(task, resource);
        	resultDateString = YDate.format(resultDate, {format: '%Y%m%d'});
        	ASSERT.areSame('20120920', resultDateString);
        	
        	Y.log(Y.JSON.stringify(me.projCal.data));
        }
        
	});
	suite.add(aTestCase);
	
	aTestCase = new Y.Test.Case({	//Test work allocation based on task dependencies and priorities
		
	});
	suite.add(aTestCase);

    Y.Test.Runner.add(suite);

});