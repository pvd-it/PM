YUI.add("list-builder-keys",function(e){function o(){}var t=37,n=39,r=8,i=46,s="readyToDeleteTag";o.prototype={initializer:function(){e.before(this._bindKeys,this,"bindUI"),this._initKeys()},_bindKeys:function(){this._keyEvents=this._inputNode.on("keydown",this._onInputKey,this)},_initKeys:function(){var e=this,s=e._keys||{};s[t]=e._keyLeft,s[n]=e._keyRight,s[r]=e._keyBackspace,s[i]=e._keyDelete,e._keys=s},_onInputKey:function(e){var t=this,n,r=e.keyCode,i=t._inputNode,o=this.get(s);this._lastInputKey=r,n=t._keys[r],n?n.call(t,e,i,o)!==!1&&e.preventDefault():this.set(s,null)},_keyLeft:function(e,t,n){if(!n&&t.get("value").length!==0)return!1;this.selectPreviousTag(n)},_keyRight:function(e,t,n){if(!n&&t.get("value").length!==0)return!1;this.selectNextTag(n)},_keyBackspace:function(e,t,n){var r=this;if(n)r.deleteSelectedTag(n,!0);else{if(t.get("value").length!==0)return!1;r.selectPreviousTag(n)}},_keyDelete:function(e,t,n){if(!n)return!1;this.deleteSelectedTag(n,!1)},destructor:function(){this._unbindKeys()},_unbindKeys:function(){this._keyEvents&&this._keyEvents.detach(),this._keyEvents=null}},e.ListBuilderKeys=o});
