var mongoose = require('mongoose'), 
	Project = require('./app-objects/project'), 
	ProjectTask = require('./app-objects/project-task'); //, Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/pmapp');

var tasks = [{
	"projectId" : "4ff117b9fe9a52e93c000030",
	"clientId" : "task_1",
	"depthLevel" : 0,
	"children" : [],
	"collapsed" : false,
	"visible" : true,
	"name" : "aa",
	"startDate" : "2012-07-01T06:30:00.000Z",
	"endDate" : "2012-07-02T06:30:00.000Z",
	"isFixedDuration" : false,
	"work" : 12,
	"duration" : "",
	"predecessors" : {},
	"successors" : {
		"FS" : {
			"task_2" : "task_2"
		}
	},
	"resources" : "",
	"position" : 0,
	"_id" : "4ff11805fe9a52e93c000037"
}, {
	"projectId" : "4ff117b9fe9a52e93c000030",
	"clientId" : "task_2",
	"depthLevel" : 0,
	"children" : [],
	"collapsed" : false,
	"visible" : true,
	"name" : "bb",
	"startDate" : "2012-07-02T06:30:00.000Z",
	"endDate" : "2012-07-04T06:30:00.000Z",
	"isFixedDuration" : false,
	"work" : 24,
	"duration" : "",
	"predecessors" : {
		"FS" : {
			"task_1" : "task_1"
		}
	},
	"successors" : {
		"FS" : {
			"task_3" : "task_3"
		}
	},
	"resources" : "",
	"position" : 1,
	"_id" : "4ff11805fe9a52e93c000038"
}, {
	"projectId" : "4ff117b9fe9a52e93c000030",
	"clientId" : "task_3",
	"depthLevel" : 0,
	"children" : [],
	"collapsed" : false,
	"visible" : true,
	"name" : "dd",
	"startDate" : "2012-07-04T06:30:00.000Z",
	"endDate" : "2012-07-10T06:30:00.000Z",
	"isFixedDuration" : false,
	"work" : 36,
	"duration" : "",
	"predecessors" : {
		"FS" : {
			"task_2" : "task_2"
		}
	},
	"resources" : "",
	"position" : 2,
	"_id" : "4ff11805fe9a52e93c000039"
}, {
	"projectId" : "4ff117b9fe9a52e93c000030",
	"clientId" : "task_4",
	"depthLevel" : 0,
	"children" : [],
	"collapsed" : false,
	"visible" : true,
	"name" : "pqr",
	"startDate" : "2012-07-10T06:30:00.000Z",
	"endDate" : "2012-07-17T06:30:00.000Z",
	"isFixedDuration" : false,
	"work" : 48,
	"duration" : "",
	"predecessors" : {
		"FS" : {
			"task_3" : "task_3"
		}
	},
	"resources" : "",
	"position" : 3,
	"_id" : "4ff11805fe9a52e93c00003a"
}];

ProjectTask.updateTasks(tasks, function(err, updateCount){
	console.log(err);
	console.log(updateCount);
});
