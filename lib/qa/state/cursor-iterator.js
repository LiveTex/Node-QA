


/**
 * Итератор по дочерним узлам выбранного узла дерева состояния.
 *
 * @constructor
 * @implements {async.input.IIterator}
 * @param {!qa.state.Cursor} cursor Выбранный узел дерева состояния.
 */
qa.state.CursorIterator = function(cursor) {

  /**
   * @type {!qa.state.Cursor}
   */
  this.__cursor = cursor;

  /**
   * @type {!Array.<string>}
   */
  this.__keys = Object.keys(Object(cursor.get())) || [];

  /**
   * @type {number}
   */
  this.__index = -1;
};


/**
 * @override
 */
qa.state.CursorIterator.prototype.next = function(callback) {
  var key = this.__keys[this.__index += 1];
  if (key !== undefined) {
    callback(this.__cursor.copy([key]));
  } else {
    callback();
  }
};


/**
 * @override
 */
qa.state.CursorIterator.prototype.destroy = function() {
  this.__keys.length = 0;
};
