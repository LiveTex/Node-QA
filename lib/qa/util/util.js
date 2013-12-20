


/**
 * @this {qa.ICase}
 * @param {*} data Данные.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.util.print = function(data, complete, cancel) {
  console.log(data);
  complete(data);
};