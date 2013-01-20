YUI.add('datatable-navigate-key', function(Y) {
    var NavigateKey,
        ACTIVE_ROW_INDEX   =   'activeRowIndex',
        ACTIVE_COL_INDEX    =   'activeColIndex',
        ACTIVE_CELL         =   'activeCell',
        ACTIVE_ROW          =   'activeRow',
        SELECTION_IN_PROGRESS = 'selectionInProgress',
        DIR_NONE            =   'NONE';
	
	Y.namespace('DataTable').NavigateKey = NavigateKey = function() {}
	
	NavigateKey.prototype = {
		initializer: function(){
			Y.Do.after(this._afterBindUI, this, 'bindUI');
		},
		
		_afterBindUI: function(){
			this.delegate('key', this._keyHandler, 'down:', null, this);
			
			//Use gallery 'event-pasted' module to capture paste event with text areas hack
			this._clipTextArea.on('pasted', Y.bind(this._pasteHandler, this), null, true);
			this.delegate('focus', this._focusHandler);
			this.delegate('blur', this._blurHandler);
			this.get('contentBox').on("selectstart", function (ev) { ev.preventDefault();});
		    this.delegate('mousedown', this._mouseDownHandler, 'tbody td', this);
			    
		},
		
		_mouseDownHandler: function(e){
		    e.preventDefault();
		    this.focus();
			this._setActiveCell(e);
			
			if (e.ctrlKey){
		    	this.doEdit();
		    }
		},
		
		 _setActiveCell: function(e){
            var cellTd = e.target,
                tr = cellTd.get('parentNode'),
                currentItemClientId = tr.getAttribute('data-yui3-record'),
                data = this.get('data'),
                columns = this.get('columns'),
                currentItem,
                row,
                col;
                
            currentItem = data.getByClientId(currentItemClientId);
            row = data.indexOf(currentItem);
            col = tr.get('children').indexOf(cellTd);
            
            this._direction = DIR_NONE;
            
            if (e.shiftKey){
                this._startSelection();
            } else if(this.get(SELECTION_IN_PROGRESS)){
                this.set(SELECTION_IN_PROGRESS, false);
                return;
            }
            
            this._set(ACTIVE_ROW_INDEX, row);
            this._set(ACTIVE_COL_INDEX, col);
            
            this.set(ACTIVE_ROW, tr);
            this.set(ACTIVE_CELL, cellTd);
            
            if (columns[col].isTreeKnob) {
                this.toggle();
            }
            
            if (e.shiftKey){
                this._doSelection();
            } else {
                this.clearSelection();                
            }
        },
		
		_focusHandler: function(e){
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
							
					case 37: //Left
						this.selectLeft();
						e.preventDefault();
						break;
					
					case 38: //Up
						this.selectUp();
						e.preventDefault();
						break;
						
					case 39: //right
						this.selectRight();
						e.preventDefault();
						break;
						
					case 40: //down
						this.selectDown();
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
						
					case 37: //Left
						this.outdent();
						this.syncUI();
						e.preventDefault();
						break;
						
					case 39: //right
						this.indent();
						this.syncUI();
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
					this.doEdit();
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