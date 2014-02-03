

/**
 * Все что может быть представленно в качестве ключа узла в дереве состояния.
 *
 * @see qa.state.Cursor
 *
 * @typedef {?(string|number)}
 */
qa.state.Key;


/**
 * Все что может быть представленно в качетсве значения узла дерева состояния.
 *
 * @see qa.state.Cursor
 *
 * @typedef {*|qa.state.Tree}
 */
qa.state.Value;


/**
 * Дерево состояния теста представляет собой вложенную таблицу.
 *
 * @typedef {Object.<!qa.state.Key, !qa.state.Value>}
 */
qa.state.Tree;


/**
 * Узел дерева состояния. То же самое, что и значение.
 * @typedef {qa.state.Value}
 */
qa.state.Node;


/**
 * Разделитель последовательности пути.
 *
 * @type {string}
 */
qa.state.PATH_SEPARATOR = '/';


/**
 * Создание шага установки указанного значения по выбранному пути.
 *
 * @see async.Step
 *
 * @param {string} path Выбранный путь.
 * @param {!qa.state.Value} value Указанное значение.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.setup = function(path, value) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function setup(data, complete, cancel) {
    this.set(tokens, value);

    complete(data);
  }

  return setup;
};


/**
 * Создание шага установки входных данных в качестве значения значения по
 * выбранному пути.
 *
 * @see async.Step
 *
 * @param {string} path Выбранный путь.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.save = function(path) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function save(data, complete, cancel) {
    this.set(tokens, data);

    complete(data);
  }

  return save;
};


/**
 * Создание шага копирования данных из выбранного пути в целевой.
 *
 * @see async.Step
 *
 * @param {string} source Выбранный путь.
 * @param {string} destination Целевой путь.
 * @param {!qa.assert.Type=} opt_type Тип копируемых данных заданный его именем
 *    либо конструктором.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.copy = function(source, destination, opt_type) {
  return async.script.sequence([
    qa.state.load(source, opt_type),
    qa.util.clone,
    qa.state.save(destination)
  ]);
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
 *
 * @param {string} path Выбранный путь.
 * @param {!qa.assert.Type=} opt_type Тип заданный его именем либо
 *    конструктором.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.load = function(path, opt_type) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function load(data, complete, cancel) {
    var value = this.get(tokens);

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
 * @this {qa.state.Cursor}
 * @param {string} path Выбранный путь.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.state.select = function(path, complete, cancel) {
  complete(this.get(path.split(qa.state.PATH_SEPARATOR)));
};


/**
 * Создание шага удаления значения по выбранному пути.
 *
 * @see async.Step
 *
 * @param {string} path Выбранный путь.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.remove = function(path) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function remove(data, complete, cancel) {
    this.remove(tokens);

    complete(data);
  }

  return remove;
};


/**
 * @this {qa.state.Cursor}
 * @param {async.Input} data Данные.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.state.key = function(data, complete, cancel) {
  complete(this.getKey());
};


/**
 * @this {qa.state.Cursor}
 * @param {async.Input} data Данные.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.state.path = function(data, complete, cancel) {
  complete(this.getPath());
};


/**
 * Создание шага изменяющего узел дерева данных выступающего в качетсве
 * контекста выполнения выбранного шага.
 *
 * Узел выбирается последовательность аргументов - ключей вложенных значений,
 * без исспользования специальных символов.
 *
 * @param {!async.Step} step Выбранный шаг.
 * @param {string} path Элемент пути к новому контексту в дереве.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.isolate = function(step, path) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function isolator(data, complete, cancel) {
    complete(this.copy(tokens));
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
qa.state.tempNode = function(step) {
  var token = (Math.random() + (qa.state.__tempTokenIndex += 1));

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function isolator(data, complete, cancel) {
    complete(this.copy([token]));
  }

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function cleanup(data, complete, cancel) {
    this.remove();
    complete(data);
  }

  return async.context.isolate(async.script.sequence([
    step, cleanup
  ]), isolator);
};


/**
 * Создание шага выполняемого в контексте узла существующего только во время
 * выполнения созданного шага.
 * Во временный узел загружаются текущие данные.
 *
 * Временный узел имеет случайное имя и является дочерним к текущему.
 *
 * @param {!async.Step} step Выбранный шаг.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.useInput = function(step) {
  var token = (Math.random() + (qa.state.__tempTokenIndex += 1));

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function isolator(data, complete, cancel) {
    this.set([token], data);
    complete(this.copy([token]));
  }

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function cleanup(data, complete, cancel) {
    this.remove();
    complete(data);
  }

  return async.context.isolate(async.script.sequence([
    step, cleanup
  ]), isolator);
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
 * @param {string=} opt_path Элементы пути.
 * @return {!async.Step} Созданный шаг.
 */
qa.state.fold = function(step, opt_path) {
  var path = (opt_path || qa.state.PathToken.CURRENT);
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @return {!qa.state.CursorIterator} Итератор.
   */
  function iteratorCreator() {
    return new qa.state.CursorIterator(this.copy(tokens));
  }

  return async.proc.fold.parallel(async.context.isolate(async.script.sequence([
    qa.state.load(qa.state.PathToken.CURRENT), step
  ]), async.nop), iteratorCreator);
};


/**
 * @type {number}
 */
qa.state.__tempTokenIndex = 0;
