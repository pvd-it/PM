YUI.add('app-common-io', function(Y){
	var YLang = Y.Lang,
		io = {
		
		_currTxn: null,
		
		_currFnProcessResponse: null,
		
		retrieve: function(url, fnProcessResponse){
			if (!this._currTxn || !this._currTxn.isInProgress()){
				
				this._currFnProcessResponse = fnProcessResponse;
				
				this._currTxn = Y.io(url, {
					method: 'GET'
				});
			}
		},
		
		send: function(url, requestText, fnProcessResponse){
			if (!this._currTxn || !this._currTxn.isInProgress()){
				
				this._currFnProcessResponse = fnProcessResponse;
				
				this._currTxn = Y.io(url, {
					method: 'POST',
					headers: {
				        'Content-Type': 'application/json',
				    },
					data: requestText
				});
			}
		},
		
		_ioStart: function(txn){
			
		},
		
		_ioComplete: function(txn, res) {
			
		},
		
		_ioSuccess: function(txn, res){
			if (YLang.isFunction(this._currFnProcessResponse)){
				this._currFnProcessResponse(res);
				this._currFnProcessResponse = null;
			}
		},
		
		_ioFailure: function(txn, res) {
			this._currFnProcessResponse = null;
		},
		
		_ioEnd: function(txn, res){
			
		}
	};
	
	Y.on('io:start', io._ioStart, io);
	Y.on('io:complete', io._ioComplete, io);
	Y.on('io:success', io._ioSuccess, io);
	Y.on('io:failure', io._ioFailure, io);
	Y.on('io:end', io._ioEnd, io);
	
	Y.namespace('ProjectManagement').io = io;
});
