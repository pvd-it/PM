YUI.add('project-calendar-tests', function(Y) {

    var ASSERT = Y.Assert,
        ARRAYASSERT = Y.ArrayAssert,
        YDate = Y.DataType.Date,
        YJSON = Y.JSON,
	    suite = new Y.Test.Suite("ProjectDependencyGraph"),
    	aTestCase;
    	
	aTestCase = new Y.Test.Case({	//Test various scenarios how a task and it's transitions are processed
        name: 'transition processing test',
        
        setUp: function(){
        },
	
	    //---------------------------------------------
	    // Tests
	    //---------------------------------------------
		'leaf task should skip processing outbound transitions as incoming transitions are not done': function(){
			var currentTaskId = 'task_2',
				currentTask = Y.Mock(),
				transition,
				projectCalendar = Y.Mock(),
				queue = Y.Mock();
			
			/*
			 * below graph represents following:
			  #|	Task Name	|	Depends on|
			 ==|================|=============|
			  0| task_0			|			  |
			 ----------------------------------
			  1| 	task_1		|			  |
			 ---------------------------------- 
			  2| 	task_2		|	1		  |
			 ----------------------------------
			  3| task_3			|	2		  |
			 ----------------------------------
			 */
			transition = {
				incoming: {
					task_2: {
						task_0: {
							type: 'SD_SD'
						},
						task_1: {
							type: 'ED_SD'
						}
					},
					
					task_0: {
						task_2: {
							type: 'ED_ED'
						}
					},
					
					task_3: {
						task_2: {
							type: 'ED_SD' 
						}
					}
				},
				
				outgoing: {
					task_2: {
						task_0: {
							type: 'ED_ED'
						},
						task_3: {
							type: 'ED_SD'
						}
					}
				}
			};
			
			Y.Mock.expect(currentTask, {
				method: 'getChildCount',
				returns: 0
			});
			
			Y.ProjectDependencyGraph.processTaskForSchedule(currentTaskId, currentTask, transition, projectCalendar, queue);
			
			Y.Mock.verify(currentTask);
			
			Y.Assert.isUndefined(transition.incoming.task_0.task_2.done);
			Y.Assert.isUndefined(transition.incoming.task_3.task_2.done);
		},
		
		'leaf task should not set start date as only 1 incoming transition is done': function(){
			var currentTaskId = 'task_2',
				currentTask = Y.Mock(),
				transition,
				projectCalendar = Y.Mock(),
				queue = Y.Mock(),
				startDateLess = new Date('December 20, 2012, 08:00:00'),
				startDateMore = new Date('December 23, 2012, 08:00:00');
			
			/*
			 * below graph represents following:
			  #|	Task Name	|	Depends on|
			 ==|================|=============|
			  0| task_0			|			  |
			 ----------------------------------
			  1| 	task_1		|			  |
			 ---------------------------------- 
			  2| 	task_2		|	1		  |
			 ----------------------------------
			  3| task_3			|	2		  |
			 ----------------------------------
			 */
			transition = {
				incoming: {
					task_2: {
						task_0: {
							type: 'SD_SD',
							value: startDateLess,
							done: true
						},
						task_1: {
							type: 'ED_SD',
						}
					},
					
					task_0: {
						task_2: {
							type: 'ED_ED'
						}
					},
					
					task_3: {
						task_2: {
							type: 'ED_SD' 
						}
					}
				},
				
				outgoing: {
					task_2: {
						task_0: {
							type: 'ED_ED'
						},
						task_3: {
							type: 'ED_SD'
						}
					}
				}
			};
			
			Y.Mock.expect(currentTask, {
				method: 'getChildCount',
				returns: 0
			});
			
			Y.ProjectDependencyGraph.processTaskForSchedule(currentTaskId, currentTask, transition, projectCalendar, queue);
			
			Y.Mock.verify(currentTask);
		},
		
		'leaf task should set start date (max) from incoming transitions': function(){
			var currentTaskId = 'task_2',
				currentTask = Y.Mock(),
				transition,
				projectCalendar = Y.Mock(),
				queue = Y.Mock(),
				startDateLess = new Date('December 20, 2012, 08:00:00'),
				startDateMore = new Date('December 23, 2012, 08:00:00');
			
			/*
			 * below graph represents following:
			  #|	Task Name	|	Depends on|
			 ==|================|=============|
			  0| task_0			|			  |
			 ----------------------------------
			  1| 	task_1		|			  |
			 ---------------------------------- 
			  2| 	task_2		|	1		  |
			 ----------------------------------
			  3| task_3			|	2		  |
			 ----------------------------------
			 */
			transition = {
				incoming: {
					task_2: {
						task_0: {
							type: 'SD_SD',
							value: startDateLess,
							done: true
						},
						task_1: {
							type: 'ED_SD',
							value: startDateMore,
							done: true
						}
					},
					
					task_0: {
						task_2: {
							type: 'ED_ED'
						}
					},
					
					task_3: {
						task_2: {
							type: 'ED_SD' 
						}
					}
				},
				
				outgoing: {
					task_2: {
						task_0: {
							type: 'ED_ED'
						},
						task_3: {
							type: 'ED_SD'
						}
					}
				}
			};
			
			Y.Mock.expect(currentTask, {
				method: 'getChildCount',
				returns: 0
			});
			
			Y.Mock.expect(currentTask, {
				method: 'set',
				args: ['startDate', startDateMore]
			});
			
			Y.Mock.expect(currentTask, {
				method: 'set',
				args: ['endDate', Y.Mock.Value.Any]
			});
			
			Y.Mock.expect(projectCalendar, {
				method: 'calcTaskEndDateWithResourceFromScratch',
				args: [currentTask]
			});
			
			Y.ProjectDependencyGraph.processTaskForSchedule(currentTaskId, currentTask, transition, projectCalendar, queue);
			
			Y.Mock.verify(currentTask);
		},
		
		'once a task has determined start date, if it processed again it shouldnt set start date again': function(){
			var currentTaskId = 'task_2',
				currentTask = Y.Mock(),
				transition,
				projectCalendar = Y.Mock(),
				queue = Y.Mock(),
				startDateLess = new Date('December 20, 2012, 08:00:00'),
				startDateMore = new Date('December 23, 2012, 08:00:00');
			
			/*
			 * below graph represents following:
			  #|	Task Name	|	Depends on|
			 ==|================|=============|
			  0| task_0			|			  |
			 ----------------------------------
			  1| 	task_1		|			  |
			 ---------------------------------- 
			  2| 	task_2		|	1		  |
			 ----------------------------------
			  3| task_3			|	2		  |
			 ----------------------------------
			 */
			transition = {
				incoming: {
					task_2: {
						task_0: {
							type: 'SD_SD',
							value: startDateLess,
							done: true
						},
						task_1: {
							type: 'ED_SD',
							value: startDateMore,
							done: true
						}
					},
					
					task_0: {
						task_2: {
							type: 'ED_ED'
						}
					},
					
					task_3: {
						task_2: {
							type: 'ED_SD' 
						}
					}
				},
				
				outgoing: {
					task_2: {
						task_0: {
							type: 'ED_ED'
						},
						task_3: {
							type: 'ED_SD'
						}
					}
				}
			};
			
			Y.Mock.expect(currentTask, {
				method: 'getChildCount',
				returns: 0
			});
			
			Y.Mock.expect(currentTask, {
				method: 'set',
				args: ['startDate', startDateMore]
			});
			
			Y.Mock.expect(projectCalendar, {
				method: 'calcTaskEndDateWithResourceFromScratch',
				args: [currentTask]
			});
			
			Y.Mock.expect(currentTask, {
				method: 'set',
				args: ['endDate', Y.Mock.Value.Any]
			});
			
			Y.ProjectDependencyGraph.processTaskForSchedule(currentTaskId, currentTask, transition, projectCalendar, queue);
			
			Y.Mock.verify(currentTask);
			
			currentTask = Y.Mock();
			Y.Mock.expect(currentTask, {
				method: 'getChildCount',
				returns: 0
			});
			
			Y.ProjectDependencyGraph.processTaskForSchedule(currentTaskId, currentTask, transition, projectCalendar, queue);
			
			Y.Mock.verify(currentTask);
		},
		
		'leaf task should set startDate as well as endDate and set outgoing transitions dependent on startDate and endDate': function(){
			var currentTaskId = 'task_2',
				currentTask = Y.Mock(),
				transition,
				projectCalendar = Y.Mock(),
				queue = Y.Mock(),
				startDateLess = new Date('December 20, 2012, 08:00:00'),
				startDateMore = new Date('December 24, 2012, 08:00:00'),
				mockEndDate = new Date('December 26, 2012, 17:00:00');
			
			/*
			 * below graph represents following:
			  #|	Task Name	|	Depends on|
			 ==|================|=============|
			  0| task_0			|			  |
			 ----------------------------------
			  1| 	task_1		|			  |
			 ---------------------------------- 
			  2| 	task_2		|	1		  |
			 ----------------------------------
			  3| task_3			|	2		  |
			 ----------------------------------
			 */
			transition = {
				incoming: {
					task_2: {
						task_0: {
							type: 'SD_SD',
							value: startDateLess,
							done: true
						},
						task_1: {
							type: 'ED_SD',
							value: startDateMore,
							done: true
						}
					},
					
					task_0: {
						task_2: {
							type: 'ED_ED'
						}
					},
					
					task_3: {
						task_2: {
							type: 'ED_SD' 
						}
					}
				},
				
				outgoing: {
					task_2: {
						task_0: {
							type: 'ED_ED'
						},
						task_3: {
							type: 'ED_SD'
						}
					}
				}
			};
			
			Y.Mock.expect(currentTask, {
				method: 'getChildCount',
				returns: 0
			});
			
			Y.Mock.expect(currentTask, {
				method: 'set',
				args: ['startDate', startDateMore],
			});
			
			Y.Mock.expect(currentTask, {
				method: 'set',
				args: ['endDate', mockEndDate]
			});
			
			Y.Mock.expect(projectCalendar, {
				method: 'calcTaskEndDateWithResourceFromScratch',
				args: [currentTask],
				returns: mockEndDate
			});
			
			Y.ProjectDependencyGraph.processTaskForSchedule(currentTaskId, currentTask, transition, projectCalendar, queue);
			
			Y.Mock.verify(currentTask);
			Y.Mock.verify(projectCalendar);
			
		}
		
	});
    suite.add(aTestCase);
    
    Y.Test.Runner.add(suite);

});