

/**
 * @type {qa.ext.ClientName}
 */
qa.ext.net.DEFAULT_CLIENT = Math.random();


/**
 * @param {string=} opt_name Имя сетевого клиента.
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.net.createClient = function(opt_name) {
  var name = opt_name || qa.ext.net.DEFAULT_CLIENT;

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function create(input, complete, cancel) {
    var client = this.getClient(name);
    if (!(client instanceof qa.ext.net.Client)) {
      this.registerClient(name, new qa.ext.net.Client());
    }

    complete(input);
  }

  return create;
};


/**
 * @param {string} optionsPath Путь к настройкам.
 * @param {string} responsePath Путь для сохранения статуса результата.
 * @param {string=} opt_name Имя сетевого клиента.
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.net.request = function(optionsPath, responsePath, opt_name) {
  var name = opt_name || qa.ext.net.DEFAULT_CLIENT;
  var optionsTokens = optionsPath.split(qa.state.PATH_SEPARATOR);
  var responseTokens = responsePath.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {string} payload Данные запроса.
   * @param {function(string)} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function request(payload, complete, cancel) {

    /**
     * @param {!Object} response Объект мета-даных результата.
     * @param {string} data Результат.
     */
    function localComplete(response, data) {
      cursor.set(responseTokens, response);
      complete(data);
    }

    var cursor = this;
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.Client) {
      var options = {};

      var optionsValue = this.get(optionsTokens);
      if (optionsValue instanceof Object) {
        options = optionsValue;
      }

      client.request(options, payload, localComplete, cancel);
    } else {
      cancel('Unable to find HTTP client.');
    }
  }

  return async.esc(request);
};


/**
 * @param {string=} opt_name Имя сетевого клиента.
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.net.destroyClient = function(opt_name) {
  var name = opt_name || qa.ext.net.DEFAULT_CLIENT;

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function create(input, complete, cancel) {
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.Client) {
      this.terminateClient(name);

      complete(input);
    } else {
      cancel('Unable to find HTTP client.');
    }
  }

  return create;
};
