YUI.add("list-builder",function(e){var t="readyToDeleteTag",n="listToEdit",r=e.Lang,i=e.Array,s=e.Node,o="item",u="Change",a="listbuilder",f=e.ClassNameManager.getClassName,l=f(a,"tag","item"),c=f(a,"tag","text"),h=f(a,"tag","close","button"),p=f(a,"tag","key","delete"),d=f(a,"tag","add");e.ListBuilder=e.Base.create(a,e.Widget,[e.ListBuilderKeys],{TAG_CLASS_NAME:l,TAG_CLOSE_BUTTON_CLASS_NAME:h,TAG_ADD_CLASS_NAME:d,CONTENT_TEMPLATE:"<ul></ul>",TAG_TEMPLATE:'<li class="'+l+'">'+'<button class="'+h+'">\u00d7</button>'+"</li>",TAG_CONTENT_TEMPLATE:'<span class="'+c+'">{text}</span>',TAG_ADD_TEMPLATE:'<li class="'+d+'">'+'<input type="text" value="" />'+"</li>",TAG_KEY_DELETABLE_CLASS_NAME:p,initializer:function(e){var r=this;r.tagTextLocator=e.resultTextLocator,r.acConfig={source:e.source,resultTextLocator:e.resultTextLocator,resultListLocator:e.resultListLocator},r.after(t+u,this._afterCurrentSelectedTagChanged),r.after(n+u,this._afterListToEditChanged)},renderUI:function(){var t=this.get("contentBox"),n=this,r;t.append(this.TAG_ADD_TEMPLATE),n.addTagNode=e.one("li"),n._inputNode=t.one("input"),n.acConfig.inputNode=n._inputNode,r={resultFilters:["phraseMatch",e.bind(n._duplicateFilter,n)],resultHighlighter:"phraseMatch"},r=e.merge(n.acConfig,r),n.ac=new e.AutoComplete(r),n.ac.render()},_duplicateFilter:function(t,n){var r=this,s=r.get("listToEdit");return e.Array.filter(n,function(e){return i.indexOf(s,e.raw)===-1})},bindUI:function(){var t=this.get("boundingBox"),n=this;t.on("click",n._handleClick,n),n.ac.after("select",e.bind(n._handleItemSelection,n))},syncUI:function(){var e=this.get(n);this._uiSetListToEdit(e)},_afterCurrentSelectedTagChanged:function(e){e.prevVal&&this._uiSetReadyToDeleteTag(e.prevVal),e.newVal?(this._uiSetReadyToDeleteTag(e.newVal),this._inputNode.addClass("inactive")):this._inputNode.removeClass("inactive")},_afterListToEditChanged:function(e){this._uiSetListToEdit(e.newVal)},_handleClick:function(e){var n=this,r=e.target;r.hasClass(n.TAG_CLOSE_BUTTON_CLASS_NAME)?n._tagCloseButtonClicked(e):r.ancestor("."+n.TAG_CLASS_NAME)||r.hasClass(n.TAG_CLASS_NAME)?n._tagItemClicked(e):n.set(t,null),this._inputNode.focus()},_tagItemClicked:function(e){var n=e.target.ancestor("."+this.TAG_CLASS_NAME);this.set(t,n)},_tagCloseButtonClicked:function(e){var n=this,r=e.target.ancestor("."+n.TAG_CLASS_NAME),i=n.get(t);i===r&&n.set(t,null),this._deleteTagItem(r)},deleteSelectedTag:function(e,n){var r=this,i;i=n?e.previous():e.next(),i=!i||i.hasClass(d)?null:i,r.set(t,i),r._deleteTagItem(e)},selectPreviousTag:function(e){var n=this,r=e?e.previous():n.addTagNode.previous();r&&n.set(t,r)},selectNextTag:function(e){var n=this,r=e?e.next():null;r=r===n.addTagNode?null:r,n.set(t,r)},_handleItemSelection:function(e){var t=this,n=e.result;t._addTagItem(n.raw),t._inputNode.set("value","")},_addTagItem:function(e){var t=this,n=t.get("contentBox"),r=this.get("itemsRemoved"),s=this.get("itemsAdded"),o=this.get("listToEdit"),u;u=i.indexOf(r,e),u<0?s.push(e):i.remove(r,u),o.push(e),n.insertBefore(t._createTagNode(e),t.addTagNode)},_deleteTagItem:function(e){var t=e.getData(o),n=this.get("itemsRemoved"),r=this.get("itemsAdded"),s=this.get("listToEdit"),u;u=i.indexOf(r,t),u<0?n.push(t):u>=0&&i.remove(r,u),i.remove(s,i.indexOf(s,t)),e.remove()},_uiSetReadyToDeleteTag:function(e){e.toggleClass(this.TAG_KEY_DELETABLE_CLASS_NAME)},_uiSetListToEdit:function(e){var t=this,n=t.get("contentBox");n.all("."+t.TAG_CLASS_NAME).remove(),i.each(e,function(e){n.insertBefore(t._createTagNode(e),t.addTagNode)})},_createTagNode:function(t){var n=this,r=s.create(n.TAG_TEMPLATE),i,u;return r.setData(o,t),n.tagFormatter?u=n.tagFormatter(t):(n.tagTextLocator?i=n.tagTextLocator(t):i=t,u=e.substitute(n.TAG_CONTENT_TEMPLATE,{text:i})),r.prepend(u)},destructor:function(){delete this.addTagNode,delete this._inputNode}},{ATTRS:{readyToDeleteTag:{},listToEdit:{value:[],setter:function(e){return r.isArray(e)?e:[]}},itemsRemoved:{value:[]},itemsAdded:{value:[]}}})});
