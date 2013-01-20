YUI.add('app-login', function(Y){
	
	Y.namespace('PMApp').Login = Login = function(){};
	
	Login.prototype = {
		doLogin: function(userId, password){
			var credentials = {userId: userId, password: password},
				strCredentials = Y.JSON.stringify(credentials),
				self = this,
				iocfg = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					data: strCredentials,
					context: self,
					on: {
						success: self._loginSuccess,
						failure: self._loginFailure
					}
					
				};
			
			Y.io('/login', iocfg);
		},
		
		_loginFailure: function(tid, res) {
			if (res.status === 401) {
				Y.fire('alert', {
					type: 'error',
					message: 'Invalid credentials. Please check and try again.'
				});
			} else if (res.status === 400){
				Y.fire('alert', {
					type: 'warning',
					message: 'Looks like your session is messed up. Try <strong><a href="/logout">logging out</a></strong> and then back in'
				});
			}
		},
		
		_loginSuccess: function(tid, res) {
			var user = Y.JSON.parse(res.responseText);
			this.fire('loginSuccess', {user: user});
		}
	};
});