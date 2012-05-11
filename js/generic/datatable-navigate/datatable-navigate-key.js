YUI.add('datatable-navigate-key', function(Y) {
	var NavigateKey;
	
	Y.namespace('DataTable').NavigateKey = NavigateKey = function() {}
	
	NavigateKey.prototype = {
		initializer: function(){
			Y.Do.after(this._afterBindUI, this, 'bindUI')
		},
		
		_afterBindUI: function(){
			this.delegate('key', this._keyHandler, 'down:', null, this);
			
			//Use gallery 'event-pasted' module to capture paste event with text areas hack
			this._clipTextArea.on('pasted', Y.bind(this._pasteHandler, this), null, true);
			this.delegate('focus', this._focusHandler);
			this.delegate('blur', this._blurHandler);
		},
		
		_focusHandler: function(e){
			Y.log('focused....');
			this.set('focused', true);
		},
		
		_blurHandler: function(e){
			this.set('focused', false);
		},
		
		_pasteHandler: function(e){
			this.doPaste(e.newVal);
		},
		
		_keyHandler: function(e){
			
			if (e.altKey){
				return;
			}
			
			if (e.shiftKey) {
				switch(e.keyCode){
					case 45: //Shift + Insert
						Y.log('Shift + Insert....');
						this.addBeforeCurrentRow();
						e.preventDefault();
						break;
				}
				return;
			}
			
			if (e.ctrlKey){
				switch(e.keyCode){
					case 35: //End
						this.moveToLastCell();
						e.preventDefault();
						break;
					
					case 36: //Home
						this.moveToFirstCell();
						e.preventDefault();
						break;
					
					case 67: //Ctrl + C means copy
						this.doCopy();
						break;
						
					case 86: //Ctrl + V means paste
						//Before the paste event fires clear the contents of text area, so that we have clean
						//slate to paste upon
						this._clipTextArea.set('value','');
						break;
				}
				
				return;
			}
			
			switch(e.keyCode){
				case 35: //End
					this.moveToLastColumn();
					e.preventDefault();
					break;
					
				case 36: //Home
					this.moveToFirstColumn();
					e.preventDefault();
					break;
					
				case 37: //Left
					this.moveLeft();
					e.preventDefault();
					break;
				
				case 38: //Up
					this.moveUp();
					e.preventDefault();
					break;
					
				case 39: //right
					this.moveRight();
					e.preventDefault();
					break;
					
				case 40: //down
					this.moveDown();
					e.preventDefault();
					break;
					
				case 13: //Enter
					this.toggle();
					e.preventDefault();
					break;
					
				case 45: //Insert
					this.addAfterCurrentRow();
					e.preventDefault();
					break;
					
				case 46: //Delete
					this.deleteCurrentRow();
					e.preventDefault();
					break;
			}
		}
	}
});