YUI.add("project",function(e){var t="load",n="save",r="error";e.Project=e.Base.create("project",e.Model,[],{initializer:function(t){this.idAttribute="_id",e.ProjectCalendar.data={},this.set("calendar",e.ProjectCalendar.data),e.ProjectDependencyGraph.dependencyGraph={transitions:{incoming:{},outgoing:{}}},this.set("dependencyGraph",e.ProjectDependencyGraph.dependencyGraph),this.set("tasks",new e.TaskList,{silent:!0}),this.set("resources",new e.ResourceList,{silent:!0})},load:function(n,i){var s=this;return typeof n=="function"&&(i=n,n={}),n||(n={}),s.sync("read",n,function(o,u){var a={options:n,response:u},f;o?(a.error=o,a.src="load",s.fire(r,a)):(s._loadEvent||(s._loadEvent=s.publish(t,{preventable:!1})),f=a.parsed=s.parse(u),s.get("resources").reset(f.resources),e.Resource.lastCount=f.lastResourceCount,e.Task.lastCount=f.lastTaskCount,e.Task.resources=s.get("resources"),s.get("tasks").reset(f.tasks),delete f.tasks,delete f.resources,s.setAttrs(f,n),s.changed={},e.ProjectCalendar.data=s.get("calendar"),e.ProjectDependencyGraph.dependencyGraph=s.get("dependencyGraph"),s.fire(t,a)),i&&i.apply(null,arguments)}),s},save:function(t,i){var s=this;return typeof t=="function"&&(i=t,t={}),t||(t={}),s._validate(s.serialize(),function(o){if(o){i&&i.call(null,o);return}s.sync(s.isNew()?"create":"update",t,function(o,u){var a={options:t,response:u},f;o?(a.error=o,a.src="save",s.fire(r,a)):(s._saveEvent||(s._saveEvent=s.publish(n,{preventable:!1})),u&&(f=a.parsed=s.parse(u),s.get("resources").reset(f.resources),e.Resource.lastCount=f.lastResourceCount,s.get("tasks").reset(f.tasks),e.Task.lastCount=f.lastTaskCount,delete f.tasks,delete f.resources,s.setAttrs(f,t),e.ProjectCalendar.data=s.get("calendar"),e.ProjectDependencyGraph.dependencyGraph=s.get("dependencyGraph"),s.changed={},s.fire(n,a))),i&&i.apply(null,arguments)})}),s},sync:function(e,t,n){var r=this[e],i={on:{success:function(e,t){n(null,t.responseText)},failure:function(e,t){n(t.statusText)}}};r&&r.call(this,i)},create:function(t){t.method="POST",t.headers={"Content-Type":"application/json"};var n=this.serialize();n.lastTaskCount=0,n.lastResourceCount=0,t.data=e.JSON.stringify(n),e.io("/data/project/create",t)},read:function(t){t.method="GET",e.io("/data/project/"+this.get("_id"),t)},update:function(t){t.method="POST",t.headers={"Content-Type":"application/json"};var n=this.serialize();n.lastTaskCount=e.Task.lastCount,n.lastResourceCount=e.Resource.lastCount,t.data=e.JSON.stringify(n),e.io("/data/project/update",t)},"delete":function(t){t.method="DELETE",e.io("/data/project/"+this.get("_id"),t)},serialize:function(){var e=this.toJSON(),t=e.tasks,n=e.resources;return e.tasks=t.serialize(),e.resources=n.serialize(),e}},{name:{},organization:{},tasks:{},resources:{},businessNeed:{},businessRequirement:{},businessValue:{},constraints:{},lastTaskCount:{},calendar:{},dependencyGraph:{}})});