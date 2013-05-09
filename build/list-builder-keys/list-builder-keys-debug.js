YUI.add('list-builder-keys', function(Y) {
	var KEY_LEFT = 37,
		KEY_RIGHT = 39,
		KEY_BACKSPACE = 8,
		KEY_DELETE = 46,
		CURRENT_SELECTED_TAG = 'readyToDeleteTag';

	function ListBuilderKeys() {
	}

	ListBuilderKeys.prototype = {

		initializer : function() {
			Y.before(this._bindKeys, this, 'bindUI');
			this._initKeys();
		},

		_bindKeys : function() {
			this._keyEvents = this._inputNode.on('keydown', this._onInputKey, this);
		},

		_initKeys : function() {
			var self = this, keys = self._keys || {};

			// Register keyboard command handlers. _keys contains handlers that will
			// always be called;
			keys[KEY_LEFT] = self._keyLeft;
			keys[KEY_RIGHT] = self._keyRight;
			keys[KEY_BACKSPACE] = self._keyBackspace;
			keys[KEY_DELETE] = self._keyDelete;

			self._keys = keys;
		},

		_onInputKey : function(e) {
			var self = this, handler, keyCode = e.keyCode, inputNode = self._inputNode, currentSelectedTag = this.get(CURRENT_SELECTED_TAG);

			this._lastInputKey = keyCode;
			handler = self._keys[keyCode];

			if (handler) {
				// A handler may return false to indicate that it doesn't wish
				// to prevent the default key behavior.
				if (handler.call(self, e, inputNode, currentSelectedTag) !== false) {
					e.preventDefault();
				}
			} else {
				this.set(CURRENT_SELECTED_TAG, null);
			}
		},

		_keyLeft : function(e, inputNode, currentSelectedTag) {
			if (currentSelectedTag || inputNode.get('value').length === 0) {
				this.selectPreviousTag(currentSelectedTag);
			} else {
				return false;
			}
		},

		_keyRight : function(e, inputNode, currentSelectedTag) {
			if (currentSelectedTag || inputNode.get('value').length === 0) {
				this.selectNextTag(currentSelectedTag);
			} else {
				return false;
			}
		},

		_keyBackspace : function(e, inputNode, currentSelectedTag) {
			var self = this;
			if (currentSelectedTag) {
				self.deleteSelectedTag(currentSelectedTag, true);
			} else if (inputNode.get('value').length === 0) {
				self.selectPreviousTag(currentSelectedTag);
			} else {
				return false;
			}
		},

		_keyDelete : function(e, inputNode, currentSelectedTag) {
			if (currentSelectedTag) {
				this.deleteSelectedTag(currentSelectedTag, false);
			} else {
				return false;
			}
		},

		destructor : function() {
			this._unbindKeys();
		},

		_unbindKeys : function() {
			this._keyEvents && this._keyEvents.detach();
			this._keyEvents = null;
		}
	};

	Y.ListBuilderKeys = ListBuilderKeys;
});