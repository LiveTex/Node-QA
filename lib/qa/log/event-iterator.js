


/**
 * @constructor
 * @implements {qa.log.IEventIterator}
 * @param {!ds.IIterator} iterator Итератор.
 */
qa.log.EventIterator = function(iterator) {

  /**
   * @type {!ds.IIterator}
   */
  this.__iterator = iterator;
};


/**
 * @param {function(!qa.log.Event=)} callback Обработчик получения.
 */
qa.log.EventIterator.prototype.next = function(callback) {
  if (this.__iterator.hasNext()) {
    callback(this.__iterator.next().get());
  } else {
    callback();
  }
};


/**
 *
 */
qa.log.EventIterator.prototype.destroy = function() {
  this.__iterator.destroy();
};
