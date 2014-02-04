


/**
 * Итератор по дочерним узлам выбранного узла дерева состояния.
 *
 * @constructor
 * @implements {async.input.IIterator}
 * @param {!qa.state.Cursor} cursor Выбранный узел дерева состояния.
 */
qa.state.CursorIterator = function(cursor) {

  /**
   * @type {qa.state.Cursor}
   */
  this.__cursor = cursor;
};


/**
 * @override
 */
qa.state.CursorIterator.prototype.next = function(callback) {
  var chunk = [];

  if (this.__cursor !== null) {
    var data = this.__cursor.get();

    for (var key in data) {
      chunk.push(this.__cursor.copy([key]));
    }

    this.__cursor = null;
  }

  callback(chunk);
};


/**
 * @override
 */
qa.state.CursorIterator.prototype.destroy = function() {};
