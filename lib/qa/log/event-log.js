


/**
 * @constructor
 * @implements {qa.log.IEventLog}
 */
qa.log.EventLog = function() {

  /**
   * @type {!ds.queue.Queue}
   */
  this.__queue = new ds.queue.Queue();
};


/**
 * @return {!qa.log.IEventIterator} Итератор.
 */
qa.log.EventLog.prototype.getIterator = function() {
  return new qa.log.EventIterator(this.__queue.getIterator());
};


/**
 * @param {!qa.log.Event} event Событие.
 */
qa.log.EventLog.prototype.pass = function(event) {
  this.__queue.push(event);
};
