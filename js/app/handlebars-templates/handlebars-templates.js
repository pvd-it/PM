YUI.add('handlebars-templates', function(Y){
	
	Y.Handlebars.registerHelper('md', function(text){
		var op = Y.Markdown.toHTML(text);
		return new Y.Handlebars.SafeString(op);
	});

	// Register a custom block helper that we'll use to perform the striping.
    Y.Handlebars.registerHelper('stripeRows', function (rows, obj) {
        var buffer = [],
            i, len;
        
        for (i = 0, len = rows.length; i < len; ++i) {
            var row = rows[i];
            row.rowClass = (i + 1) % 2 === 0 ? 'even' : 'odd';

            // Render the block once for each row.
            buffer.push(obj.fn(row));
    	}

        return buffer.join('');
    });

	
	Y.namespace('HandlebarsTemplates');
	
	
		Y.HandlebarsTemplates['t-dashboard'] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n		<li><a href=\"/project/";
  foundHelper = helpers._id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a></li>\n	";
  return buffer;}

  buffer += "<ul class=\"nav nav-tabs nav-stacked\">\n	";
  foundHelper = helpers.currentProjects;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)}); }
  else { stack1 = depth0.currentProjects; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.currentProjects) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;};
	
		Y.HandlebarsTemplates['t-gantt'] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n			<tr class=\"yui3-datatable-tree-row-depth-";
  foundHelper = helpers.depthLevel;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.depthLevel; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\n				<td class=\"yui3-datatable-tree-col\">\n					";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "						\n				</td>\n			</tr>\n			";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n							<th colspan=\"";
  foundHelper = helpers.dayCount;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dayCount; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</th>\n						";
  return buffer;}

function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n							";
  foundHelper = helpers.days;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)}); }
  else { stack1 = depth0.days; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.days) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						";
  return buffer;}
function program6(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n								<th>";
  foundHelper = helpers.dayInMonth;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dayInMonth; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</th>\n							";
  return buffer;}

function program8(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n							";
  foundHelper = helpers.days;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(9, program9, data)}); }
  else { stack1 = depth0.days; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.days) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(9, program9, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						";
  return buffer;}
function program9(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n								<td>";
  foundHelper = helpers.dayName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dayName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\n							";
  return buffer;}

function program11(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n							";
  foundHelper = helpers.days;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(12, program12, data)}); }
  else { stack1 = depth0.days; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.days) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(12, program12, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						";
  return buffer;}
function program12(depth0,data) {
  
  
  return "\n								<td></td>\n							";}

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<tr>\n						<td class=\"task-bar\">\n							";
  stack1 = depth0.isParent;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(17, program17, data),fn:self.program(15, program15, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "					\n						</td>\n					</tr>\n				";
  return buffer;}
function program15(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n								<div class=\"parent-bar progress\" style=\"margin-left: ";
  foundHelper = helpers.startShift;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.startShift; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "px; width: ";
  foundHelper = helpers.barWidth;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.barWidth; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "px;\">\n									<div class=\"bar bar-warning\" style=\"width: 100%\"></div>\n									<div class=\"startCorner\"></div>\n									<div class=\"endCorner\"></div>\n								</div>\n							";
  return buffer;}

function program17(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n								<div class=\"task-bar progress\" style=\"margin-left: ";
  foundHelper = helpers.startShift;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.startShift; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "px; width: ";
  foundHelper = helpers.barWidth;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.barWidth; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "px;\">\n									<div class=\"bar\" style=\"width: 100%\"></div>\n								</div>\n							";
  return buffer;}

  buffer += "<div class=\"gantt-chart yui3-skin-sam\">\n	<div class=\"task-list\">	\n		<table class=\"table table-bordered table-condensed\">\n			<tr>\n				<th>Month</th>\n			</tr>\n			<tr>\n				<th>Date</th>\n			</tr>\n			<tr>\n				<th>Day</th>\n			</tr>\n			";
  foundHelper = helpers.tasks;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)}); }
  else { stack1 = depth0.tasks; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.tasks) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</table>\n	</div>\n\n	<div class=\"gantt-grid\" id=\"gantt-scrollview-content\">\n		<div class=\"timeline\">\n			<table class=\"table table-bordered table-condensed table-gantt\">\n				<tbody>\n					<tr>\n						";
  foundHelper = helpers.months;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)}); }
  else { stack1 = depth0.months; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.months) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</tr>\n					<tr>\n						";
  foundHelper = helpers.months;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)}); }
  else { stack1 = depth0.months; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.months) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</tr>\n					<tr>\n						";
  foundHelper = helpers.months;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(8, program8, data)}); }
  else { stack1 = depth0.months; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.months) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(8, program8, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</tr>\n					<tr class=\"timeline-grid\">\n						";
  foundHelper = helpers.months;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(11, program11, data)}); }
  else { stack1 = depth0.months; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.months) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(11, program11, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</tr>\n				</tbody>\n			</table>\n		</div>\n		\n		<div class=\"task-bars\">\n			<table class=\"table table-bordered table-condensed\">\n				";
  foundHelper = helpers.tasks;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(14, program14, data)}); }
  else { stack1 = depth0.tasks; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.tasks) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(14, program14, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</table>\n		</div>\n	</div>\n</div>\n";
  return buffer;};
	
		Y.HandlebarsTemplates['t-newproject'] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<form class=\"form-horizontal\">\n	<fieldset>\n		<div class=\"control-group\">\n			<label for=\"project-name\" class=\"control-label\">Name of Project</label>\n			<div class=\"controls\">\n				<input type=\"text\" id=\"project-name\" class=\"input-xxlarge\">\n				<p class=\"help-block\">\n					In addition to freeform text, any HTML5 text-based input appears like so.\n				</p>\n			</div>\n		</div>					\n		<div class=\"control-group\">\n			<label for=\"business-need\" class=\"control-label\">Business Need</label>\n			<div class=\"controls\">\n				<textarea rows=\"3\" id=\"business-need\" class=\"input-xxlarge\"></textarea>\n				<p class=\"help-block\">\n					The business-related reason for initiating the system.\n				</p>\n			</div>\n		</div>\n		<div class=\"control-group\">\n			<label for=\"business-requirement\" class=\"control-label\">Business Requirement</label>\n			<div class=\"controls\">\n				<textarea rows=\"3\" id=\"business-requirement\" class=\"input-xxlarge\"></textarea>\n				<p class=\"help-block\">\n					The business capabilities that the system will provide.\n				</p>\n			</div>\n		</div>\n		<div class=\"control-group\">\n			<label for=\"business-value\" class=\"control-label\">Business Value</label>\n			<div class=\"controls\">\n				<textarea rows=\"3\" id=\"business-value\" class=\"input-xxlarge\"></textarea>\n				<p class=\"help-block\">\n					The benefits that the system will create for the organization.\n				</p>\n			</div>\n		</div>\n		<div class=\"control-group\">\n			<label for=\"business-value\" class=\"control-label\">Constraints</label>\n			<div class=\"controls\">\n				<textarea rows=\"3\" id=\"constraints\" class=\"input-xxlarge\"></textarea>\n				<p class=\"help-block\">\n					Issues that are relevant to the implementation of the system and decisions made by the committee about the project. \n				</p>\n			</div>\n		</div>\n		<div class=\"form-actions\">\n			<button class=\"btn btn-primary\" type=\"submit\">\n				Save changes\n			</button>\n			<button class=\"btn\">\n				Cancel\n			</button>\n		</div>\n	</fieldset>\n</form>";};
	
		Y.HandlebarsTemplates['t-project'] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<dl>\n	<dt>Business Need</dt>\n	<dd>";
  stack1 = depth0.businessNeed;
  foundHelper = helpers.md;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "md", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "</dd>\n	\n	<dt>Business Requirement</dt>\n	<dd>";
  stack1 = depth0.businessRequirement;
  foundHelper = helpers.md;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "md", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "</dd>\n	\n	<dt>Business Value</dt>\n	<dd>";
  stack1 = depth0.businessValue;
  foundHelper = helpers.md;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "md", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "</dd>\n	\n	<dt>Constraints</dt>\n	<dd>";
  stack1 = depth0.constraints;
  foundHelper = helpers.md;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "md", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "</dd>\n</dl>\n\n<div class=\"form-actions\">\n	<button class=\"btn btn-warning\" type=\"submit\">\n		Edit\n	</button>\n</div>\n";
  return buffer;};
	
});