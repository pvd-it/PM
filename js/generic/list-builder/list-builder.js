YUI.add('list-builder', function(Y){
	var ListBuilder = function(){
			ListBuilder.superclass.constructor.apply(this, arguments);
		},
		READY_TO_DELETE_TAG = 'readyToDeleteTag',
		LIST_TO_EDIT = 'listToEdit',
		YLang = Y.Lang,
		YArray = Y.Array,
		YNode = Y.Node,
		TAG_ITEM = 'item', 
		CHANGE = 'Change';
		
		ListBuilder.NAME = 'listbuilder';
		
		ListBuilder.ATTRS = {
			readyToDeleteTag: {
				
			},
			
			listToEdit: {
				value: [],
				validator: function(value){
					return YLang.isArray(value);
				}
			},
			
			itemsRemoved: {
				value: []
			},
			
			itemsAdded: {
				value: []
			}
		}
	
	var	getClassName =	Y.ClassNameManager.getClassName,
		TAG_CLASS_NAME = getClassName(ListBuilder.NAME, 'tag', 'item'),
		TAG_TEXT_CLASS_NAME = getClassName(ListBuilder.NAME, 'tag', 'text'),
		TAG_CLOSE_BUTTON_CLASS_NAME = getClassName(ListBuilder.NAME, 'tag', 'close', 'button'),
		TAG_KEY_DELETABLE_CLASS_NAME = getClassName(ListBuilder.NAME, 'tag', 'key', 'delete');
	
	Y.ListBuilder = ListBuilder = Y.extend(ListBuilder, Y.Widget, {
		TAG_CLASS_NAME: TAG_CLASS_NAME,
		
		TAG_TEXT_CLASS_NAME: TAG_TEXT_CLASS_NAME,
		
		TAG_CLOSE_BUTTON_CLASS_NAME: TAG_CLOSE_BUTTON_CLASS_NAME,
		
		CONTENT_TEMPLATE: 	'<ul></ul>',
		
		TAG_TEMPLATE: 		'<li class="' + TAG_CLASS_NAME + '"></li>',
							
		TAG_CONTENT_TEMPLATE: '<span class="' + TAG_TEXT_CLASS_NAME + '">{text}</span>' +
								'<button class="' + TAG_CLOSE_BUTTON_CLASS_NAME + '">×</button>',
		
		TAG_ADD_TEMPLATE:	'<li class="' + getClassName(ListBuilder.NAME, 'tag', 'add') + '">' + 
						  		'<input type="text" value="" />' +
						  	'</li>',
		
		TAG_KEY_DELETABLE_CLASS_NAME: TAG_KEY_DELETABLE_CLASS_NAME,					
						  	
		initializer: function(config){
			this.acConfig = config.acConfig;
			if (config.acConfig.resultTextLocator){
				this.tagTextLocator = config.acConfig.resultTextLocator;
			}
			this.after(READY_TO_DELETE_TAG+CHANGE, this._afterReadyToDeleteTagChanged);
		},
		
		renderUI: function(){
			var cb = this.get('contentBox'),
				self = this;
			
			cb.append(this.TAG_ADD_TEMPLATE);
			self.addTagNode = Y.one('li');
			self.textInputNode = cb.one('input');
			if (self.acConfig){
				self.acConfig.inputNode = self.textInputNode
				self.acConfig.render = true;
				self.ac = new Y.AutoComplete(self.acConfig);
			}
		},
		
		bindUI: function(){
			var bb = this.get('boundingBox'),
				self = this;
			bb.delegate('click', self._tagCloseButtonClicked, '.' + self.TAG_CLOSE_BUTTON_CLASS_NAME, self);
			bb.delegate('click', self._tagContainerClicked, '.' + self.getClassName('content'), self);
			self.textInputNode.on('key', this._handleKey, 'down:', self);
			if (self.acConfig){
				self.ac.after('select', this._handleItemSelection, this);
			}
		},
		
		syncUI: function(){
			var items = this.get(LIST_TO_EDIT);
			this._uiSetListToEdit(items);
		},

		_afterReadyToDeleteTagChanged: function(e){
			if (e.prevVal){
				this._uiSetReadyToDeleteTag(e.prevVal);
			}
			
			if (e.newVal){
				this._uiSetReadyToDeleteTag(e.newVal);
			}
		},
		
		_tagCloseButtonClicked: function(e){
			var tagItemNode = e.target.ancestor('.'+this.TAG_CLASS_NAME);
			this._deleteTagItem(tagItemNode);
		},
		
		_tagContainerClicked: function(e){
			this.textInputNode.focus();
		},
		
		_handleKey: function(e){
			var inputNode = this.textInputNode,
				readyToDeleteTag  = this.get(READY_TO_DELETE_TAG); 
			if (e.keyCode === 8){ //Backspace
				if(inputNode.get('value').length === 0){
					if (readyToDeleteTag) {
						this._deleteTagItem(readyToDeleteTag);
						this.set(READY_TO_DELETE_TAG, null);
					} else {
						this.set(READY_TO_DELETE_TAG, inputNode.get('parentNode').previous()); 
					}
				}
			} else {
				if(readyToDeleteTag){
					this.set(READY_TO_DELETE_TAG, null);
				}
			}
		},

		_handleItemSelection: function(e){
			var self = this,
				item = e.result;
				
			this._addTagItem(item.raw);
			self.textInputNode.set('value', '');
		},
		
		_addTagItem: function(tagItem){
			var self = this,
				cb = self.get('contentBox'),
				itemsRemoved = this.get('itemsRemoved'),
				itemsAdded = this.get('itemsAdded'),
				listToEdit = this.get('listToEdit'),
				removedListIndex;
				
			removedListIndex = YArray.indexOf(itemsRemoved, tagItem);
			if (removedListIndex < 0) {
				itemsAdded.push(tagItem);
			} else {
				YArray.remove(itemsRemoved, removedListIndex);
			}
			
			listToEdit.push(tagItem);
			
			cb.insertBefore(self._createTagNode(tagItem), self.addTagNode);
		},
		
		_deleteTagItem: function(tagItemNode){
			var tagItem = tagItemNode.getData(TAG_ITEM),
				itemsRemoved = this.get('itemsRemoved'),
				itemsAdded = this.get('itemsAdded'),
				listToEdit = this.get('listToEdit'),
				addListIndex;
			
			addListIndex = YArray.indexOf(itemsAdded, tagItem);
			if (addListIndex < 0){
				itemsRemoved.push(tagItem);
			} else if (addListIndex >= 0){
				YArray.remove(itemsAdded, addListIndex);
			}
			
			YArray.remove(listToEdit, YArray.indexOf(listToEdit, tagItem));
			tagItemNode.remove();
		},
		
		_uiSetReadyToDeleteTag: function(tagNode) {
			tagNode.toggleClass(this.TAG_KEY_DELETABLE_CLASS_NAME);
		},
		
		_uiSetListToEdit: function(items){
			var self = this,
				cb = self.get('contentBox');
			YArray.each(items, function(item){
				cb.insertBefore(self._createTagNode(item), self.addTagNode);
			});
		},
		
		_createTagNode: function(item){
			var self = this,
				node = YNode.create(self.TAG_TEMPLATE),
				text,
				formatterMarkup;
			
			node.setData(TAG_ITEM, item);
			
			//If tagFormatter is present use it to generate TAG content
			if (self.tagFormatter){
				formatterMarkup = self.tagFormatter(item);
			} else {
				//If tagFormatter is not present, check to see if tagTextLocator is supplied
				if (self.tagTextLocator) {
					text = self.tagTextLocator(item);
				} else { //If no tagTextLocator is supplied then assume we have list of strings
					text = item
				}
				formatterMarkup = Y.substitute(self.TAG_CONTENT_TEMPLATE, {text: text})
			}
			return node.append(formatterMarkup);
		},
		
		destructor: function(){
			delete this.addTagNode;
			delete this.textInputNode;
		}
						  	
	});
});
