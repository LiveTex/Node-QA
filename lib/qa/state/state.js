

/**
 * Создание шага установки указанного значения по выбранному пути.
 *
 * @see async.Step
 * @see qa.state.Path
 *
 * @param {string} path Выбранный путь.
 * @param {*} value Указанное значение.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.setup = function(path, value) {
  var evaluator = new qa.state.Path(path);

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function setup(data, complete, cancel) {
    evaluator.set(this, value);
    complete(data);
  }

  return setup;
};


/**
 * Создание шага установки входных данных в качестве значения значения по
 * выбранному пути.
 *
 * @see async.Step
 * @see qa.state.Path
 *
 * @param {string} path Выбранный путь.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.save = function(path) {
  var evaluator = new qa.state.Path(path);

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function save(data, complete, cancel) {
    evaluator.set(this, data);
    complete(data);
  }

  return save;
};


/**
 * Создание шага передачи выбранного по пути значению в обработчик результата
 * выполнения шага.
 *
 * В качетсве опционального параметра создание принимает тип выбираемого
 * значения. Если значение не соответствует указанному типу, выполнение шага
 * завершается обработчиком ошибки.
 *
 * @see async.Step
 * @see qa.state.Path
 *
 * @param {string} path Выбранный путь.
 * @param {(string|!Object)=} opt_type Тип заданный его именем либо
 *    конструктором.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.load = function(path, opt_type) {
  var evaluator = new qa.state.Path(path);

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
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
 * Создание шага удаления значения по выбранному пути.
 *
 * @see async.Step
 * @see qa.state.Path
 *
 * @param {string} path Выбранный путь.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.remove = function(path) {
  var evaluator = new qa.state.Path(path);

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function remove(data, complete, cancel) {
    evaluator.set(this, null);
    complete(data);
  }

  return remove;
};


/**
 * Создание шага изменяющего узел дерева данных выступающего в качетсве
 * контекста выполнения выбранного шага.
 *
 * Узел выбирается последовательность аргументов - ключей вложенных значений,
 * без исспользования специальных символов.
 *
 * @param {!async.Step} step Выбранный шаг.
 * @param {string} pathToken Элемент пути к новому контексту в дереве.
 * @param {...string} var_pathTokens Последующие элементы пути.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.isolate = function(step, pathToken, var_pathTokens) {
  var path = Array.prototype.slice.call(arguments);
  path.shift();

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function isolator(data, complete, cancel) {
    var node = this;

    for (var i = 0; i < path.length; i += 1) {
      node = node.growChild(path[i]);
    }

    complete(node);
  }

  return async.context.isolate(step, isolator);
};


/**
 * Создание шага выполняемого в контексте узла существующего только во время
 * выполнения созданного шага.
 *
 * Временный узел имеет случайное имя и является дочерним к текущему.
 *
 * @param {!async.Step} step Выбранный шаг.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.temp = function(step) {
  var token = (Math.random() + (qa.state.__tempTokenIndex += 1));

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function isolator(data, complete, cancel) {
    complete(this.growChild(token));
  }

  /**
   * @this {qa.state.Node}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function cleanup(data, complete, cancel) {
    this.set(token, null);
    complete(data);
  }


  return async.script.sequence([
    async.context.isolate(step, isolator),
    cleanup
  ]);
};


/**
 * Свертка по дочерним узлам заданного.
 *
 * Свертка выполняется с помощью указанного шага. Обработка значения каждого
 * дочернего узла выполняется в контексте объекта узла.
 *
 * Узел выбирается последовательность аргументов - ключей вложенных значений,
 * без исспользования специальных символов.
 *
 * @param {!async.Step} step Указанный шаг.
 * @param {...string} var_pathTokens Элементы пути.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.fold = function(step, var_pathTokens) {
  var path = Array.prototype.slice.call(arguments);
  path.shift();

  /**
   * @this {qa.state.Node}
   * @return {!qa.state.NodeIterator} Итератор.
   */
  function iteratorCreator() {
    var node = this;

    for (var i = 0; i < path.length; i += 1) {
      node = node.growChild(path[i]);
    }

    return new qa.state.NodeIterator(node);
  }

  return async.proc.fold.parallel(async.context.isolate(async.script.sequence([
    qa.state.load(qa.state.PathToken.CURRENT), step
  ]), async.nop), iteratorCreator);
};


/**
 * @type {number}
 */
qa.state.__tempTokenIndex = 0;
