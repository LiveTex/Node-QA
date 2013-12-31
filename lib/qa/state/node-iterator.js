


/**
 * Итератор по дочерним узлам выбранного узла дерева состояния.
 *
 * @constructor
 * @extends {async.input.ArrayIterator}
 * @param {!qa.state.Node} input Выбранный узел дерева состояния.
 */
qa.state.NodeIterator = function(input) {
  async.input.ArrayIterator.call(this, input.growChildren());
};

util.inherits(qa.state.NodeIterator, async.input.ArrayIterator);
