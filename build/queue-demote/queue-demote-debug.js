YUI.add('queue-demote', function(Y, NAME) {

	/**
	 * Adds methods demote and demotePush Queue instances.
	 *
	 * @module queue-demote
	 * @for Queue
	 */

	Y.mix(Y.Queue.prototype, {
		/**
		* Moves the referenced item to the tail of the queue
		*
		* @method demote
		* @param item {MIXED} an item in the queue
		*/
		demote : function(item) {
			var index = this.indexOf(item);

			if (index > -1) {
				this._q.push(this._q.splice(index,1)[0]);
			}
		},

		/**
		* Sees if an item is already in queue, if yes then move to item to tail of queue
		* otherwise add item in the last
		*
		* @method demotePush
		* @param item {MIXED} an item in the queue
		*/
		demotePush : function(item) {
			var index = this.indexOf(item);
			if (index > -1) {
				this._q.push(this._q.splice(index,1)[0]);
			} else {
				this._q.push(item);
			}
		}
	});

}, '3.7.3', {
	"requires" : ["yui-base"]
});
