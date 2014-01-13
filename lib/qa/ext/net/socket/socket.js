

/**
 * @param {!qa.ext.net.socket.AbstractSocket} socket Сокет.
 * @return {!async.input.IIterator} Итератор.
 */
qa.ext.net.socket.MESSAGE_ITERATOR = function(socket) {
  return new qa.ext.net.socket.MessageIterator(socket);
};


/**
 * @param {string} name Имя соединения.
 * @param {string} optionsPath Путь к настройкам.
 * @param {string=} opt_netClientName Имя сетевого клиента.
 * @return {!async.Step} Шаг создания сокет соединения.
 */
qa.ext.net.socket.create = function(name, optionsPath, opt_netClientName) {
  var optionsTokens = optionsPath.split(qa.state.PATH_SEPARATOR);
  var netClientName = opt_netClientName || qa.ext.net.DEFAULT_CLIENT;

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function create(input, complete, cancel) {
    var client = this.getClient(netClientName);
    if (client instanceof qa.ext.net.Client) {
      var options = {};
      var optionsValue = this.get(optionsTokens);
      if (optionsValue instanceof Object) {
        options = optionsValue;
      }

      this.registerClient(name, client.createSocket(options));

      complete(input);
    } else {
      cancel('Unable to find HTTP client.');
    }
  }

  return create;
};


/**
 * @param {string} name Имя соединения.
 * @return {!async.Step} Шаг получения сокет соединения.
 */
qa.ext.net.socket.get = function(name) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {function(!qa.ext.net.socket.AbstractSocket)} complete Обработчик
   *    результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function get(input, complete, cancel) {
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.socket.AbstractSocket) {
      complete(client);
    } else {
      cancel('Unable to find socket.');
    }
  }

  return get;
};


/**
 * @param {string} name Имя соединения.
 * @return {!async.Step} Шаг отсылки сообщения.
 */
qa.ext.net.socket.send = function(name) {

  /**
   * @this {qa.state.Cursor}
   * @param {string} message Данные запроса.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function send(message, complete, cancel) {
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.socket.AbstractSocket) {
      client.send(message);
      complete(null);
    } else {
      cancel('Unable to find socket.');
    }
  }

  return async.esc(send);
};


/**
 * @param {string} name Имя соединения.
 * @param {!async.Step} handler Шаг обработки сообщениея.
 * @return {!async.proc.fold.Scenario} Созданный сценарий обрабоки.
 */
qa.ext.net.socket.listen = function(name, handler) {
  var iterator = async.input.escIterator(qa.ext.net.socket.MESSAGE_ITERATOR);

  return async.script([
    qa.ext.net.socket.get(name),
    async.proc.fold.parallel(handler, iterator, async.output.NULL_COLLECTOR)
  ]);
};


/**
 * @param {string} name Имя соединения.
 * @return {!async.Step} Шаг разрушения сокет соединения.
 */
qa.ext.net.socket.destroy = function(name) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function destroy(input, complete, cancel) {
    var client = this.terminateClient(name);
    if (client instanceof qa.ext.net.socket.AbstractSocket) {
      client.destroy();

      complete(input);
    } else {
      cancel('Unable to find socket.');
    }
  }

  return destroy;
};