var Handlebars		=	require('yui/handlebars').Handlebars,
	fs 				=	require('fs'),
	path			=	require('path'),


	templateRoot	=	path.join(__dirname, '../templates'),
	generatorTemplateFile = path.join(__dirname, '../handlebars-templates.hbs'),
	generatorTemplate,
	generatedJs,
	generatedJsFile = path.join(__dirname, '../handlebars-templates.js'),
	filePath,
	fileContent,
	compiledTemplates = [],
    precompiled;fileContent

fs.readdir(templateRoot, function(err, files){
	if (err){
		console.log(err);
		return;
	}
	
	files.forEach(function(file){
		filePath = path.join(templateRoot, file);
		fileContent = fs.readFileSync(filePath, 'utf-8');
		
		var clientTemplate = {};
		clientTemplate['name'] = getFileName(file);
		clientTemplate['func'] = Handlebars.precompile(fileContent);
		
		compiledTemplates.push(clientTemplate);
	});
	
	fileContent = fs.readFileSync(generatorTemplateFile, 'utf-8');
	
	generatorTemplate = Handlebars.compile(fileContent);
	
	generatedJs = generatorTemplate({
		compiledTemplates: compiledTemplates
	});
	
	fs.writeFileSync(generatedJsFile, generatedJs);
});

function getFileName(fullFileName){
	var lastDotIndex = fullFileName.lastIndexOf('.');
	return fullFileName.substring(0, lastDotIndex);
}

