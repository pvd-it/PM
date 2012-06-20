var mongoose = require('mongoose'),
	User = require('./app-objects/user'),
	Organization = require('./app-objects/organization');

mongoose.connect('mongodb://nodejitsu:7473599b0969b76144917a93936805f0@staff.mongohq.com:10040/nodejitsudb650685699003');
//mongoose.connect('mongodb://localhost/pmapp');

var monsterIncUsers = [
  { name: 'James Sullivan',				userId: 'james.sullivan@monster.inc',					password: 'james.sullivan@monster.inc',			},				
  { name: 'Randal Boggs',				userId: 'randal.boggs@monster.inc',						password: 'randal.boggs@monster.inc',			},				
  { name: 'Mike Wazowski',				userId: 'mike.wazowski@monster.inc',					password: 'mike.wazowski@monster.inc',			},				
  { name: 'George Sanderson',			userId: 'george.sanderson@monster.inc',					password: 'george.sanderson@monster.inc',		},				
  { name: 'Henry J Waternoose',			userId: 'henryj.waternoose@monster.inc',				password: 'henryj.waternoose@monster.inc',		},				
  { name: 'Roz',						userId: 'roz@monster.inc',								password: 'roz@monster.inc',					},				
  { name: 'Celia Rae',					userId: 'celia.rae@monster.inc',						password: 'celia.rae@monster.inc',				},				
  { name: 'Jeff Fungus',				userId: 'jeff.fungus@monster.inc',						password: 'jeff.fungus@monster.inc',			},				
  { name: 'Abominable Snowman',			userId: 'abominable.snowman@monster.inc',				password: 'abominable.snowman@monster.inc',		},				
],
	monsterIncOrg = {
		name: 'Monsters Inc'
	};

var org, user, len, i;

org = new Organization(monsterIncOrg);
org.save(function(err){
	console.log(err);
	len = monsterIncUsers.length;
	i = 0;
		
	for (;i < len; i++){
		var user = monsterIncUsers[i];
		user.organization = org._id;
		new User(user).save();
	}
});


var honexIndUsers = [
  { name: 'Barry B Benson',				userId: 'barryb.benson@honex.ind',				password: 'barryb.benson@honex.ind',		},				
  { name: 'Adam Flayman',				userId: 'adam.flayman@honex.ind',				password: 'adam.flayman@honex.ind',			},				
  { name: 'Vanessa Bloome',				userId: 'vanessa.bloome@honex.ind',				password: 'vanessa.bloome@honex.ind',		},				
  { name: 'Ken',						userId: 'ken@honex.ind',						password: 'ken@honex.ind',					},				
  { name: 'Janet B Benson',				userId: 'janetb.benson@honex.ind',				password: 'janetb.benson@honex.ind',		},				
  { name: 'Martin B Benson',			userId: 'martinb.benson@honex.ind',				password: 'martinb.benson@honex.ind',		},				
  { name: 'Martin B Benson',			userId: 'martinb.benson@honex.ind',				password: 'martinb.benson@honex.ind',		},				
  { name: 'Layton T Montgomery',		userId: 'laytont.montgomery@honex.ind',			password: 'laytont.montgomery@honex.ind',	}, 
],
	honexIndOrg = {
		name: 'Honex Industries'
	};
	
org = new Organization(honexIndOrg);

org.save(function(err){
	console.log(err);
	len = honexIndUsers.length,
	i = 0;
		
	for (;i < len; i++){
		var user = honexIndUsers[i];
		user.organization = org._id;
		new User(user).save();
	}
});