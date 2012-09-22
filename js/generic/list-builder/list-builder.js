YUI.add('list-builder', function(Y){
	var CURRENT_SELECTED_TAG = 'readyToDeleteTag',
		LIST_TO_EDIT = 'listToEdit',
		YLang = Y.Lang,
		YArray = Y.Array,
		YNode = Y.Node,
		TAG_ITEM = 'item', 
		CHANGE = 'Change',
		NAME = 'listbuilder';
	
	var	getClassName =	Y.ClassNameManager.getClassName,
		TAG_CLASS_NAME = getClassName(NAME, 'tag', 'item'),
		TAG_TEXT_CLASS_NAME = getClassName(NAME, 'tag', 'text'),
		TAG_CLOSE_BUTTON_CLASS_NAME = getClassName(NAME, 'tag', 'close', 'button'),
		TAG_KEY_DELETABLE_CLASS_NAME = getClassName(NAME, 'tag', 'key', 'delete'),
		TAG_ADD_CLASS_NAME = getClassName(NAME, 'tag', 'add');
	
	Y.ListBuilder = Y.Base.create(NAME, Y.Widget, [Y.ListBuilderKeys], {

		TAG_CLASS_NAME: TAG_CLASS_NAME,
		
		TAG_CLOSE_BUTTON_CLASS_NAME: TAG_CLOSE_BUTTON_CLASS_NAME,
		
		TAG_ADD_CLASS_NAME: TAG_ADD_CLASS_NAME,
		
		CONTENT_TEMPLATE		: 	'<ul></ul>',
		
		TAG_TEMPLATE			: 	'<li class="' + TAG_CLASS_NAME + '">' +
										'<button class="' + TAG_CLOSE_BUTTON_CLASS_NAME + '">×</button>' +
										'</li>',
							
		TAG_CONTENT_TEMPLATE	: 	'<span class="' + TAG_TEXT_CLASS_NAME + '">{text}</span>',
		
		TAG_ADD_TEMPLATE		:	'<li class="' + TAG_ADD_CLASS_NAME + '">' + 
						  				'<input type="text" value="" />' +
						  			'</li>',
		
		TAG_KEY_DELETABLE_CLASS_NAME: TAG_KEY_DELETABLE_CLASS_NAME,
						  	
		initializer: function(config){
			var self = this;
			self.tagTextLocator = config.resultTextLocator;
			self.acConfig = {
				source: config.source,
				resultTextLocator: config.resultTextLocator
			};
			self.after(CURRENT_SELECTED_TAG+CHANGE, this._afterCurrentSelectedTagChanged);
			self.after(LIST_TO_EDIT+CHANGE, this._afterListToEditChanged);
		},
		
		renderUI: function(){
			var cb = this.get('contentBox'),
				self = this;
			
			cb.append(this.TAG_ADD_TEMPLATE);
			self.addTagNode = Y.one('li');
			self._inputNode = cb.one('input');
			
			self.acConfig.inputNode = self._inputNode;
			var myAcConfig = {
				resultFilters: ['phraseMatch', Y.bind(self._duplicateFilter, self)],
				resultHighlighter: 'phraseMatch',
			};
			
			myAcConfig = Y.merge(self.acConfig, myAcConfig);
			self.ac = new Y.AutoComplete(myAcConfig);
			
			self.ac.render();
		},
		
		/*
		 * While tagging it's necessary not to add same tag again. So this is custom filter
		 * which prevents options from master list to be displayed if they are already added.
		 */
		_duplicateFilter: function(query, results){
			var self = this,
				currentTags = self.get('listToEdit');
			
			return Y.Array.filter(results, function (result) {
				return YArray.indexOf(currentTags, result.raw) === -1;
			});
		},
		
		bindUI: function(){
			var bb = this.get('boundingBox'),
				self = this;
			bb.on('click', self._handleClick, self);
			self.ac.after('select', Y.bind(self._handleItemSelection, self));
		},
		
		syncUI: function(){
			var items = this.get(LIST_TO_EDIT);
			this._uiSetListToEdit(items);
		},

		_afterCurrentSelectedTagChanged: function(e){
			if (e.prevVal){
				this._uiSetReadyToDeleteTag(e.prevVal);
			}
			
			if (e.newVal){
				this._uiSetReadyToDeleteTag(e.newVal);
				this._inputNode.addClass('inactive');
			} else {
				this._inputNode.removeClass('inactive');
			}
		},
		
		_afterListToEditChanged: function(e){
			this._uiSetListToEdit(e.newVal);
		},
		
		_handleClick: function(e){
			var self = this,
				clickedElement = e.target;
				
			if (clickedElement.hasClass(self.TAG_CLOSE_BUTTON_CLASS_NAME)){
				self._tagCloseButtonClicked(e);
			} else if (clickedElement.ancestor('.' + self.TAG_CLASS_NAME) || clickedElement.hasClass(self.TAG_CLASS_NAME)){
				self._tagItemClicked(e);
			} else {
				self.set(CURRENT_SELECTED_TAG, null);
			}
			
			this._inputNode.focus();
		},
		
		_tagItemClicked: function(e){
			var tagNode = e.target.ancestor('.'+this.TAG_CLASS_NAME);
			this.set(CURRENT_SELECTED_TAG, tagNode);
		},
		
		_tagCloseButtonClicked: function(e){
			var self = this,
				tagItemNode = e.target.ancestor('.'+ self.TAG_CLASS_NAME),
				currentSelectedTag = self.get(CURRENT_SELECTED_TAG);
			
			if (currentSelectedTag === tagItemNode){	//If the item being deleted is the one which is selected as well, make the current selection as void
				self.set(CURRENT_SELECTED_TAG, null);
			}
			
			this._deleteTagItem(tagItemNode);
		},
		
		/**
		 * When deleting from keyboard (backspace or delete button), we need to select previous/next item.
		 * Use this function from keyboard events indiacating selectPrev=true/false.
		 */
		deleteSelectedTag: function(currentSelectedTag, selectPrev){
			var self = this,
				newSelectedTag;
			
			// From the tag, which is about to get deleted find previous or next tag
			newSelectedTag = selectPrev ? currentSelectedTag.previous() : currentSelectedTag.next();  
			// if you deleted the very first tag using backspace (i.e. selectPrev === true), then there is no previous tag so you get back to input field
			// if you deleted the last tag using delete (i.e. selectPrev === false), then next tag would be addTagNode, which means you are back to input field
			newSelectedTag = (!newSelectedTag || newSelectedTag.hasClass(TAG_ADD_CLASS_NAME)) ? null : newSelectedTag;

			self.set(CURRENT_SELECTED_TAG, newSelectedTag);
							
			self._deleteTagItem(currentSelectedTag);
		},
		
		selectPreviousTag: function(currentSelectedTag){
			var self = this,
				//if currently a tag is already selected then get previous other wise if no tag is selected get previous of addTagNode
				newSelectedTag = (currentSelectedTag) ? currentSelectedTag.previous() : self.addTagNode.previous();
			
			//if newSelectedTag is found then set it. If none is found, which can occur in two cases
			// 1. currentSelectedTag is the first tag, so there is no previous, so no need to change the selection
			// 2. no tags are present, so previous to addTagNode is null, again no need to change the selection
			newSelectedTag && self.set(CURRENT_SELECTED_TAG, newSelectedTag);
		},
		
		selectNextTag: function(currentSelectedTag){
			var self = this,
				//if no currentSelectedTag then we are on addTagNode, so newselectedtag will be null,
				newSelectedTag = currentSelectedTag ? currentSelectedTag.next() : null;
			
			//if currentSelectedTag was the last tag (just before addTagNode) then next would return addTagNode. addTagNode means no currentSelectedTag
			newSelectedTag = (newSelectedTag === self.addTagNode) ? null : newSelectedTag;
			
			self.set(CURRENT_SELECTED_TAG, newSelectedTag);
		},
		
		_handleItemSelection: function(e){
			var self = this,
				item = e.result;
				
			self._addTagItem(item.raw);
			self._inputNode.set('value', '');
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
			
			cb.all('.'+self.TAG_CLASS_NAME).remove();			
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
			return node.prepend(formatterMarkup);
		},
		
		destructor: function(){
			delete this.addTagNode;
			delete this._inputNode;
		}
	}, {
		ATTRS: {
			readyToDeleteTag: {
				
			},
			
			listToEdit: {
				value: [],
				setter: function(value){
					return YLang.isArray(value) ? value : [];
				}
			},
			
			itemsRemoved: {
				value: []
			},
			
			itemsAdded: {
				value: []
			},
			
		}
	});
	
});
