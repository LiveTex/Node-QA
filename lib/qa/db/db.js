

/**
 * @param {string} path Path to value.
 * @param {*} value Value.
 * @return {!async.Actor} Актор.
 */
qa.db.setup = function(path, value) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function setup(data, complete, cancel) {
    evaluator.set(this.getDataNode(), value);
    complete(data);
  }

  return setup;
};


/**
 * @param {string} path Path to value.
 * @return {!async.Actor} Актор.
 */
qa.db.save = function(path) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function save(data, complete, cancel) {
    evaluator.set(this.getDataNode(), data);
    complete(data);
  }

  return save;
};


/**
 * @param {string} path Path to value.
 * @param {(string|!Object)=} opt_type Тип.
 * @return {!async.Actor} Актор.
 */
qa.db.load = function(path, opt_type) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    var value = evaluator.get(this.getDataNode());

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
 * @return {!async.Actor} Актор.
 */
qa.db.remove = function(path) {
  var evaluator = new qa.db.Path(path);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function save(data, complete, cancel) {
    evaluator.set(this.getDataNode(), null);
    complete(data);
  }

  return save;
};
