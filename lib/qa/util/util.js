

/**
 * @this {qa.state.Cursor}
 * @param {async.Input} input Данные.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.util.clone = function(input, complete, cancel) {
  try {
    complete(qa.util.cloneSync(input));
  } catch (error) {
    cancel(error.message);
  }
};


/**
 * @param {*} value Значение.
 * @return {*} Его копия.
 */
qa.util.cloneSync = function(value) {
  if (value instanceof Object) {
    var clone = new value.constructor();

    for (var param in value) {
      clone[param] = qa.state.clone(value[param]);
    }

    return clone;
  }

  return value;
};
