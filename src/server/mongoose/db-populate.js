var mongoose = require('mongoose'),
	User = require('./app-objects/user').model,
	Organization = require('./app-objects/organization');

mongoose.connect('mongodb://db:db@mongo.onmodulus.net:27017/uxy7Tomy');
//mongoose.connect('mongodb://localhost/pmapp');

var monsterIncUsers = [
  { name: 'James Sullivan',				userName: 'james.sullivan@monster.inc',					password: 'james.sullivan@monster.inc',			},				
  { name: 'Randal Boggs',				userName: 'randal.boggs@monster.inc',					password: 'randal.boggs@monster.inc',			},				
  { name: 'Mike Wazowski',				userName: 'mike.wazowski@monster.inc',					password: 'mike.wazowski@monster.inc',			},				
  { name: 'George Sanderson',			userName: 'george.sanderson@monster.inc',				password: 'george.sanderson@monster.inc',		},				
  { name: 'Henry J Waternoose',			userName: 'henryj.waternoose@monster.inc',				password: 'henryj.waternoose@monster.inc',		},				
  { name: 'Roz',						userName: 'roz@monster.inc',							password: 'roz@monster.inc',					},				
  { name: 'Celia Rae',					userName: 'celia.rae@monster.inc',						password: 'celia.rae@monster.inc',				},				
  { name: 'Jeff Fungus',				userName: 'jeff.fungus@monster.inc',					password: 'jeff.fungus@monster.inc',			},				
  { name: 'Abominable Snowman',			userName: 'abominable.snowman@monster.inc',				password: 'abominable.snowman@monster.inc',		},				
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
  { name: 'Barry B Benson',				userName: 'barryb.benson@honex.ind',				password: 'barryb.benson@honex.ind',		},				
  { name: 'Adam Flayman',				userName: 'adam.flayman@honex.ind',					password: 'adam.flayman@honex.ind',			},				
  { name: 'Vanessa Bloome',				userName: 'vanessa.bloome@honex.ind',				password: 'vanessa.bloome@honex.ind',		},				
  { name: 'Ken',						userName: 'ken@honex.ind',							password: 'ken@honex.ind',					},				
  { name: 'Janet B Benson',				userName: 'janetb.benson@honex.ind',				password: 'janetb.benson@honex.ind',		},				
  { name: 'Martin B Benson',			userName: 'martinb.benson@honex.ind',				password: 'martinb.benson@honex.ind',		},				
  { name: 'Martin B Benson',			userName: 'martinb.benson@honex.ind',				password: 'martinb.benson@honex.ind',		},				
  { name: 'Layton T Montgomery',		userName: 'laytont.montgomery@honex.ind',			password: 'laytont.montgomery@honex.ind',	}, 
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