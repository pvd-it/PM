YUI.add('app-base-fix', function(Y) {
	var AppBaseFix,
		Lang = Y.Lang;
	
	Y.AppBaseFix = AppBaseFix = function() {
	};

	AppBaseFix.prototype = {
		_uiSetActiveView : function(newView, oldView, options) {

			options || ( options = {});

			var callback = options.callback,
				isChild = this._isChildView(newView, oldView),
				isParent = !isChild && this._isParentView(newView, oldView),
				prepend = !!options.prepend || isParent;

			// Prevent detaching (thus removing) the view we want to show. Also hard
			// to animate out and in, the same view.
			if (newView === oldView) {
				return callback && callback.call(this, newView);
			}

			this._attachView(newView, prepend, options);
			this._detachView(oldView);

			if (callback) {
				callback.call(this, newView);
			}
		},
		
		showView : function(view, config, options, callback) {
			var viewInfo, created;

			options || ( options = {});

			// Support the callback function being either the third or fourth arg.
			if (callback) {
				options = Y.merge(options, {
					callback : callback
				});
			} else if (Lang.isFunction(options)) {
				options = {
					callback : options
				};
			}

			if (Lang.isString(view)) {
				viewInfo = this.getViewInfo(view);

				// Use the preserved view instance, or create a new view.
				// TODO: Maybe we can remove the strict check for `preserve` and
				// assume we'll use a View instance if it is there, and just check
				// `preserve` when detaching?
				if (viewInfo && viewInfo.preserve && viewInfo.instance) {
					view = viewInfo.instance;

					// Make sure there's a mapping back to the view metadata.
					this._viewInfoMap[Y.stamp(view, true)] = viewInfo;
				} else {
					// TODO: Add the app as a bubble target during construction, but
					// make sure to check that it isn't already in `bubbleTargets`!
					// This will allow the app to be notified for about _all_ of the
					// view's events. **Note:** This should _only_ happen if the
					// view is created _after_ `activeViewChange`.

					view = this.createView(view, config);
					created = true;
				}
			}

			// Update the specified or preserved `view` when signaled to do so.
			// There's no need to updated a view if it was _just_ created.
			if (options.update && !created) {
				view.setAttrs(config);
			}

			// When a value is specified for `options.render`, prefer it because it
			// represents the developer's intent. When no value is specified, the
			// `view` will only be rendered if it was just created.
			if ('render' in options) {
				if (options.render) {
					options.render = true;
				}
			} else if (created) {
				options.render = true;
			}

			return this._set('activeView', view, {
				options : options
			});
		},

		_attachView : function(view, prepend, options) {
			if (!view) {
				return;
			}

			var viewInfo = this.getViewInfo(view), viewContainer = this.get('viewContainer');

			// Bubble the view's events to this app.
			view.addTarget(this);

			// Save the view instance in the `views` registry.
			if (viewInfo) {
				viewInfo.instance = view;
			}

			// TODO: Attach events here for persevered Views?
			// See related TODO in `_detachView`.

			// Insert view into the DOM.
			viewContainer[prepend ? 'prepend' : 'append'](view.get('container'));
			if (options.render === true) {
				view.render();
			}
		}
	};
});
