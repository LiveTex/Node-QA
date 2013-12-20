



/**
 * @this {qa.ICase}
 * @param {string} data Данные.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.util.json.decode = function(data, complete, cancel) {
  try {
    complete(JSON.parse(data));
  } catch (error) {
    cancel(error.message);
  }
};