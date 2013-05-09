YUI.add('workflow-view', function(Y){
	var YObject = Y.Object;
	
	Y.namespace('PMApp').WorkflowView = Y.Base.create('workflowView', Y.View, [], {
		
		graphNodeTemplate: '<div class="dot">' +
						        '<div class="fat-finger" title="Drag to change start point"></div>' +
						        '<div class="number-label">{label}</div>' +
						        '<div class="level">{level}</div>' +
						    '</div>',
		nodeLevel: {},						
		
		render: function(){
			var self = this,
				container = self.get('container'),
				og = Y.ProjectDependencyGraph.dependencyGraph.transitions.outgoing,
				q = new Y.Queue(),
				node,
				trans,
				nodeLevel = this.nodeLevel;
				
			container.append('<div id="workflowgraphiccontainer"></div>');
			
			q.add('task_0');
			nodeLevel['task_0'] = 1;
			nodeLevel[1] = 1;
			
			while(q.size()>0){
				Y.log(q._q);
				node = q.next();
				trans = og[node];
				YObject.each(trans, function(val, key, obj){
					if (val.type !== 'ED_ED'){
						q.demotePush(key);
						nodeLevel[key] = nodeLevel[node] + 1;
					}
				});
				
				container.append(self._createGraphDOMNode(node, nodeLevel[node]));
			}
			
			Y.log(nodeLevel);
		},
		
		_createGraphDOMNode: function(label, level){
			this.nodeLevel[level] = this.nodeLevel[level]=== undefined ? 1: this.nodeLevel[level]+1;
			return Y.Node.create(Y.substitute(this.graphNodeTemplate, {label: label, level: level}))
						.setStyle('left', (300 + 100 * level) + 'px')
						.setStyle('top', (100 * this.nodeLevel[level]) + 'px');
		}
	});
});
