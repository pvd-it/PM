YUI.add('mock-fix', function(Y) {
	var YLang = Y.Lang;

	Y.Mock.expect = function(mock/*:Object*/, expectation /*:Object*/) {

		//make sure there's a place to store the expectations
		if (!mock.__expectations) {
			mock.__expectations = {};
		}

		//method expectation
		if (expectation.method) {
			var name = expectation.method,
				args = expectation.args || [],
				callCount = ( typeof expectation.callCount === "number") ? expectation.callCount : 1,
				run = expectation.run || function() {
					},
				i;

			//save expectations
			mock.__expectations[name] = mock.__expectations[name] ? mock.__expectations[name] : [];
			mock.__expectations[name].push(expectation);
			expectation.callCount = callCount;
			expectation.actualCallCount = 0;
			expectation.args = args;
			expectation.run = run;

			//process arguments
			for ( i = 0; i < args.length; i++) {
				if (!(args[i] instanceof Y.Mock.Value)) {
					args[i] = Y.Mock.Value(Y.Assert.areSame, [args[i]], "Argument " + i + " of " + name + "() is incorrect.");
				}
			}

			mock[name] = mock[name] ? mock[name] : function() {
				var currExpec = mock.__expectations[name][0],
					runResult,
					i;

				if (currExpec.actualCallCount < currExpec.callCount) {
					currExpec.actualCallCount++;
				} else if ((currExpec.callCount !== 0) && (currExpec.actualCallCount === currExpec.callCount)) {
					currExpec = mock.__expectations[name].shift();
					mock.__expectations[name].push(currExpec);
					currExpec = mock.__expectations[name][0];
					currExpec.actualCallCount++;
				} else {
					try {
						Y.Assert.fail("Method " + name + "() should not have been called.");
					} catch (ex) {
						//route through TestRunner for proper handling
						Y.Test.Runner._handleError(ex);
					}
				}

				try {
					Y.Assert.areEqual(currExpec.args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
					for (i = 0, len = currExpec.args.length; i < len; i++) {
						currExpec.args[i].verify(arguments[i]);
					}

					runResult = currExpec.run.apply(this, arguments);

					if (currExpec.error) {
						throw currExpec.error;
					}
				} catch (ex) {
					//route through TestRunner for proper handling
					Y.Test.Runner._handleError(ex);
				}

				// Any value provided for 'returns' overrides any value returned
				// by our 'run' function.
				return currExpec.hasOwnProperty('returns') ? currExpec.returns : runResult;

			};

		} else if (expectation.property) {
			//save expectations
			mock.__expectations[expectation.property] = expectation;
		}
	};

	/**
	 * Verifies that all expectations of a mock object have been met and
	 * throws an assertion error if not.
	 * @param {Object} mock The object to verify..
	 * @return {void}
	 * @method verify
	 * @static
	 */
	Y.Mock.verify = function(mock) {
		try {
			for (var name in mock.__expectations) {
				if (mock.__expectations.hasOwnProperty(name)) {
					var expectation = mock.__expectations[name],
						i, len, expec;
					if (YLang.isArray(expectation)) {
						for (i = 0, len = expectation.length; i < len; i++) {
							expec = expectation[i];
							Y.Assert.areEqual(expec.callCount,
									expec.actualCallCount,
									"Method " + expec.method + "() wasn't called the expected number of times.");
						}
					} else if (expectation.property) {
						Y.Assert.areEqual(expectation.value,
									mock[expectation.property],
									"Property " + expectation.property + " wasn't set to the correct value.");
					}
				}
			}

		} catch (ex) {
			//route through TestRunner for proper handling
			Y.Test.Runner._handleError(ex);
		}
	};
});
