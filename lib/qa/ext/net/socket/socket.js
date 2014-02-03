

/**
 * @param {!qa.ext.net.socket.Wrapper} socket Сокет.
 * @return {!async.input.IIterator} Итератор.
 */
qa.ext.net.socket.MESSAGE_ITERATOR = function(socket) {
  return new qa.ext.net.socket.MessageIterator(socket);
};


/**
 * Остановка прослушивания сокета.
 *
 * @type {!async.Step}
 */
qa.ext.net.socket.CONTINUE = async.insert(null);


/**
 * @param {string} name Connection name.
 * @param {qa.ext.net.SocketType} type Socket type.
 * @param {string} optionsPath Path to options in local storage.
 * @param {string=} opt_netClientName Net client name.
 * @return {!async.Step} Socket creation step.
 */
qa.ext.net.socket.create = function(name, type, optionsPath,
                                    opt_netClientName) {

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

      var socket = null;
      switch (type) {
        case qa.ext.net.SocketType.ECHO: {
          socket = new qa.ext.net.socket.EchoSocket();
          break;
        }

        case qa.ext.net.SocketType.WEBSOCKET: {
          socket = new qa.ext.net.socket.WebSocket(options);
        }
      }

      if (socket !== null) {
        this.registerClient(name, client.createSocket(socket));
        complete(input);
      } else {
        cancel('Unable to create socket. [qa.ext.net.socket.create]');
      }
    } else {
      cancel('Unable to find HTTP client. [qa.ext.net.socket.create]');
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
   * @param {function(!qa.ext.net.socket.Wrapper)} complete Обработчик
   *    результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function get(input, complete, cancel) {
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.socket.Wrapper) {
      complete(client);
    } else {
      cancel('Unable to find socket. [qa.ext.net.socket.get]');
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
    if (client instanceof qa.ext.net.socket.Wrapper) {
      client.send(message);
      complete(null);
    } else {
      cancel('Unable to find socket. [qa.ext.net.socket.send]');
    }
  }

  return async.esc(send);
};


/**
 * @param {string} name Имя соединения.
 * @return {!async.Step} Шаг отсылки сообщения.
 */
qa.ext.net.socket.resume = function(name) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Данные запроса.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function resume(input, complete, cancel) {
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.socket.Wrapper) {
      client.resume();

      complete(input);
    } else {
      cancel('Unable to find socket. [qa.ext.net.socket.resume]');
    }
  }

  return async.esc(resume);
};


/**
 * @param {string} name Имя соединения.
 * @return {!async.Step} Шаг отсылки сообщения.
 */
qa.ext.net.socket.pause = function(name) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Данные запроса.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function resume(input, complete, cancel) {
    var client = this.getClient(name);
    if (client instanceof qa.ext.net.socket.Wrapper) {
      client.pause();

      complete(input);
    } else {
      cancel('Unable to find socket. [qa.ext.net.socket.pause]');
    }
  }

  return async.esc(resume);
};


/**
 * @param {string} name Имя соединения.
 * @param {!async.Step} handler Шаг обработки сообщениея.
 * @return {!async.proc.fold.Scenario} Созданный сценарий обрабоки.
 */
qa.ext.net.socket.listen = function(name, handler) {
  var iterator = async.input.escIterator(qa.ext.net.socket.MESSAGE_ITERATOR);

  return async.script.sequence([
    qa.ext.net.socket.get(name),
    async.proc.fold.sequence(handler, iterator,
        async.output.ONE_COLLECTOR, async.script.IS_NULL)
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
    this.terminateClient(name);
    complete(input);
  }

  return destroy;
};
