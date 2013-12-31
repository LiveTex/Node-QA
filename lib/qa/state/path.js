


/**
 * Класс объекта взятия и изменения данных по выбранному пути в дереве
 * состояния теста относительного выбираемого узла.
 *
 * Для создания соответсвующего экземпляра необходимо строковое представление
 * пути в дереве.
 *
 * Представление пути модно описать как последовательность выбора значений
 * ключей во вложенных таблицах. Элементы такой последовательности
 * разделяются символом `/`.
 *
 * При наличии символа `/` в начале последовательности путь считается
 * абсолютным. Абсолюным называется путь раскрывающий вложенность из корня
 * дерева. Наличие символа `/` в окончании последовательности не имеет значения.
 *
 * Например:
 * ```
 * /global/path/to/value - выпор по абсолютному пути;
 * relative/path/to/value - выпор по относительному пути;
 * / - выбор корневого узла.
 * ```
 *
 * Символы `.`, `..` и `$` являются служебными и использутся для получения
 * дополнительных возможностей выбора значений.
 *
 * `.` - взятие текущего узла в последовательности. Например:
 * ```
 * some/value/. - тоже что и some/value;
 * . - выбор текущего узла.
 * ```
 *
 * `..` - взятие родительского узла, при его наличии. Например:
 * ```
 * some/value/.. - тоже что и some;
 * ../ - выбор родительского узла;
 * ../sibling - выбор соседнего узла.
 * ```
 *
 * `$` - взятие ключа узла. Данный символ влияет на выборку только при получении
 * значения и в качетсве последнего элемента. Например:
 *
 * `.` - взятие текущего узла в последовательности. Например:
 * ```
 * some/value/$ - тоже что и получить значение "value";
 * some/$/value - здесь символ "$" интерпретируется как вложенное поле;
 * $ - выбор ключа текущего узла.
 * ```
 *
 * @see qa.state.Node
 * @see qa.state.PathToken
 *
 * @constructor
 * @param {string} path Путь к данным.
 */
qa.state.Path = function(path) {

  /**
   * @type {!Array.<string>}
   */
  this.__path = path.split(qa.state.PathToken.SEPARATOR);

  /**
   * @type {string}
   */
  this.__key = this.__path.pop();
};


/**
 * Выборка данных по установленному пути относительно заданного узла.
 *
 * @param {!qa.state.Node} node Заданный узел.
 * @return {*} Узел-результат выборки.
 */
qa.state.Path.prototype.get = function(node) {
  var target = this.__getChild(node, 0);
  if (target !== null) {
    return target.get(this.__key);
  }

  return null;
};


/**
 * Установка данных по установленному пути относительно заданного узла.
 *
 * Установка значения `null` для всех узлов кроме корневого соответствует его
 * удалению.
 *
 * @param {!qa.state.Node} node Заданный узел.
 * @param {*} value Значение.
 */
qa.state.Path.prototype.set = function(node, value) {
  var target = this.__growChild(node, 0);
  if (target !== null) {
    if (value !== null) {
      target.set(this.__key, value);
    } else {
      target.remove(this.__key);
    }
  }
};


/**
 * Функция рекурсивной выборки данных.
 *
 * @param {!qa.state.Node} node Узел для выборки.
 * @param {number} index Индекс элемента пути.
 * @return {qa.state.Node} Ррезультат выборки.
 */
qa.state.Path.prototype.__getChild = function(node, index) {
  if (this.__path.length > index) {
    var next = this.__getByToken(this.__path[index], node);
    if (next !== null) {
      return this.__getChild(next, index + 1);
    }

    return next;
  }

  return node;
};


/**
 * Функция рекурсивной выборки данных.
 *
 * @param {!qa.state.Node} node Узел для выборки.
 * @param {number} index Индекс элемента пути.
 * @return {qa.state.Node} Ррезультат выборки.
 */
qa.state.Path.prototype.__growChild = function(node, index) {
  if (this.__path.length > index) {
    var next = this.__growByToken(this.__path[index], node);
    if (next !== null) {
      return this.__growChild(next, index + 1);
    }

    return next;
  }

  return node;
};


/**
 * Применение элемента ключа пути к узлу данных.
 *
 * @param {string} token Ключ пути.
 * @param {!qa.state.Node} node Узел данных.
 * @return {qa.state.Node} Результат применения.
 */
qa.state.Path.prototype.__getByToken = function(token, node) {
  if (token.length === 0) {
    return node.getRoot();
  }

  if (token === qa.state.PathToken.CURRENT) {
    return node;
  }

  if (token === qa.state.PathToken.PARENT) {
    return node.getParent();
  }

  return node.getChild(token);
};


/**
 * Применение элемента ключа пути к узлу данных.
 *
 * @param {string} token Ключ пути.
 * @param {!qa.state.Node} node Узел данных.
 * @return {qa.state.Node} Результат применения.
 */
qa.state.Path.prototype.__growByToken = function(token, node) {
  if (token.length === 0) {
    return node.getRoot();
  }

  if (token === qa.state.PathToken.CURRENT) {
    return node;
  }

  if (token === qa.state.PathToken.PARENT) {
    return node.getParent();
  }

  return node.growChild(token);
};
