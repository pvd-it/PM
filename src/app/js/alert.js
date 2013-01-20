YUI.add('alert', function(Y){

	var YNode = Y.Node,
		Alert,
		getClassName = Y.ClassNameManager.getClassName;

	Alert = function(config){
		Alert.superclass.constructor.apply(this, arguments);
	};

	Alert.NAME = 'alert';

	Alert.CLOSE_BUTTON_CLASS = 'close'; //Prefer bootstrap class names over yui3 style class names
	Alert.CLOSE_BUTTON_TEMPLATE = '<button class="' + Alert.CLOSE_BUTTON_CLASS + '" type="button">×</button>';

	Alert.HEADING_CLASS = getClassName(Alert.NAME, 'heading');
	Alert.HEADING_TEMPLATE = '<h4 class="' + Alert.HEADING_CLASS + '"></h4>';

	Alert.MESSAGE_CLASS = getClassName(Alert.NAME, 'message');
	Alert.MESSAGE_TEMPLATE = '<p class="' + Alert.MESSAGE_CLASS + '"></p>';

	Alert.ERROR = 'error';
	Alert.WARNING = 'warning';
	Alert.SUCCESS = 'success';
	Alert.INFO = 'info';

	Alert.ATTRS = {
		type: {
		},
		
		message: {
		}
	};

	Y.Alert = Alert = Y.extend(Alert, Y.Widget, {
		renderUI: function(){
			var cb = this.get('contentBox');

			cb.addClass('alert alert-block');

			this._renderCloseButton(cb);
			this._renderHeading(cb);
			this._renderMessage(cb);
		},

		bindUI: function(){
			this.after('typeChange', this._afterTypeChange);
			this.after('messageChange', this._afterMessageChange);
			this.closeButton.on('click', Y.bind(this._closeClickHandler, this));
		},

		syncUI: function(){
			this._uiSetAlertType(this.get('type'));
			this._uiSetAlertMessage(this.get('message'));
		},

		show: function(){
			Alert.superclass.constructor.prototype.show.apply(self, arguments);
			this.get('contentBox').setStyles({
				opacity: 1,
				display: block
			});
		},

		_closeClickHandler: function(e){
			this.close();
		},

		close: function(noEffect){
			var self = this;
			if (noEffect){
				self.hide();
				return;
			}

			this.get('contentBox').hide('fadeOut', null, function() {
				self.hide();
				self.fire('closed');
			});
		},

		_afterTypeChange: function(e){
			if (e.newVal){
				this._uiSetAlertType(e.newVal);
			}

			if (e.prevVal){
				this._uiUnSetAlertType(e.prevVal);
			}
		},

		_afterMessageChange: function(e){
			this._uiUnSetAlertType(e.newVal);
		},

		_uiSetAlertType: function(type){
			var typeClass = 'alert-' + type,
				heading;

			switch(type){
				case Alert.ERROR:
					heading = 'Error';
					break;
				case Alert.WARNING:
					heading = 'Warning';
					break;
				case Alert.SUCCESS:
					heading = 'Success';
					break;
				case Alert.INFO:
					heading = 'Info';
					break;
				default:
					throw new Error('Invalid alert type:' + type);
			}
			this.heading.set('innerHTML', heading + '!');
			this.get('contentBox').addClass(typeClass);
		},

		_uiUnSetAlertType: function(type){
			var typeClass = 'alert-' + type;
			this.get('contentBox').removeClass(typeClass);
		},

		_uiSetAlertMessage: function(msg){
			this.message.set('innerHTML', msg);
		},

		_renderCloseButton: function(cb){
			var closeButton = cb.one('.' + Alert.CLOSE_BUTTON_CLASS);

			if(!closeButton){
				closeButton = YNode.create(Alert.CLOSE_BUTTON_TEMPLATE);
				cb.append(closeButton);
			}

			this.closeButton = closeButton;
		},

		_renderHeading: function(cb){
			var heading = cb.one('.' + Alert.HEADING_CLASS);

			if (!heading){
				heading = YNode.create(Alert.HEADING_TEMPLATE);
				cb.append(heading);
			}

			this.heading = heading;
		},

		_renderMessage: function(cb){
			var message = cb.one('.' + Alert.MESSAGE_CLASS);

			if(!message){
				message = YNode.create(Alert.MESSAGE_TEMPLATE);
				cb.append(message);
			}

			this.message = message;
		}
	});

});
