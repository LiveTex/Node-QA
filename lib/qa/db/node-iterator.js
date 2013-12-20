


/**
 * Итератор по массиву реализованному экземпляром стандартного типа `Array`.
 *
 * @constructor
 * @extends {async.input.ArrayIterator}
 * @param {!qa.db.Node} input Входные данные выполнения шага.
 */
qa.db.NodeIterator = function(input) {
  async.input.ArrayIterator.call(this, input.growChildren());
};

util.inherits(qa.db.NodeIterator, async.input.ArrayIterator);
