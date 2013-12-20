

/**
 * @param {string} path Path to value.
 * @param {*} value Value.
 * @return {!async.Step} Актор.
 */
qa.db.setup = function(path, value) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function setup(data, complete, cancel) {
    evaluator.set(this, value);
    complete(data);
  }

  return setup;
};


/**
 * @param {string} path Path to value.
 * @return {!async.Step} Актор.
 */
qa.db.save = function(path) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function save(data, complete, cancel) {
    evaluator.set(this, data);
    complete(data);
  }

  return save;
};


/**
 * @param {string} path Path to value.
 * @param {(string|!Object)=} opt_type Тип.
 * @return {!async.Step} Актор.
 */
qa.db.load = function(path, opt_type) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    var value = evaluator.get(this);

    if (opt_type === undefined) {
      complete(value);
    } else if (typeof value === opt_type ||
        opt_type instanceof Object && value instanceof opt_type) {

      complete(value);
    } else {
      cancel('Type mismatch: "' + value + '" at "' + path +
          '" is not "' + opt_type + '".');
    }
  }

  return load;
};


/**
 * @param {string} path Path to value.
 * @return {!async.Step} Актор.
 */
qa.db.remove = function(path) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function remove(data, complete, cancel) {
    evaluator.set(this, null);
    complete(data);
  }

  return remove;
};


/**
 * @param step {!async.Step} Актор.
 * @param {...string} var_tokens Данные.
 * @return {!async.Step} Актор.
 */
qa.db.fold = function(step, var_tokens) {
  var path = Array.prototype.slice.call(arguments);
  path.shift();

  /**
   * @return {!qa.db.NodeIterator} Итератор.
   */
  function iteratorCreator() {
    var node = this;

    for (var i = 0; i < path.length; i += 1) {
      node = node.growChild(path[i]);
    }

    return new qa.db.NodeIterator(node);
  }

  return async.proc.fold.parallel(
      async.context.isolate(step, async.nop), iteratorCreator);
};

