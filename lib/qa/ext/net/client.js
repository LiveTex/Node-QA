


/**
 * @constructor
 * @extends {events.EventEmitter}
 * @implements {qa.ext.IClient}
 * @param {qa.ext.net.CookieJar=} opt_cookieJar
 *
 * @event message
 */
qa.ext.net.Client = function(opt_cookieJar) {
  events.EventEmitter.call(this);

  /**
   * @type {!qa.ext.net.CookieJar}
   */
  this.__cookieJar = opt_cookieJar || new qa.ext.net.CookieJar();
};

util.inherits(qa.ext.net.Client, events.EventEmitter);


/**
 * @param {!Object} options Параметры запроса.
 * @param {string} payload Данные запроса.
 * @param {function(!Object, string)} complete Обработик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошиюки.
 */
qa.ext.net.Client.prototype.request =
    function(options, payload, complete, cancel) {

  var self = this;

  /**
   * @param {!http.ServerResponse} response Объетк ответа.
   */
  function responseHandler(response) {
    var headers = response.headers;
    var data = '';

    response.addListener('data', function(chunk) {
      data += chunk;
    });

    response.addListener('end', function() {
      response.removeAllListeners();

      for (var i in headers['set-cookie']) {
        self.__cookieJar.set(
            new qa.ext.net.Cookie(headers['set-cookie'][i]));
      }

      complete({
        'status': response.statusCode,
        'headers': headers
      }, data);
    });

    request.removeAllListeners();
  }

  /**
   * @param {!Error} error Ошибка.
   */
  function errorHandler(error) {
    request.removeAllListeners();
    cancel(error.message);
  }

  if (!options.hasOwnProperty('headers') ||
      !(options['headers'] instanceof Object)) {
    options.headers = {};
  }
  options.headers['Content-Length'] = payload.length;

  var request = http.request(
      this.__cookieJar.populateCookieHeaders(util.obj.clone(options)));

  request.addListener('response', responseHandler);
  request.addListener('error', errorHandler);
  request.end(payload);
};


/**
 * @param {qa.ext.net.socket.ISocket} socket Socket implementation.
 * @return {!qa.ext.net.socket.Wrapper} Wrapped socket.
 */
qa.ext.net.Client.prototype.createSocket = function(socket) {
  return new qa.ext.net.socket.Wrapper(socket);
};


/**
 * @inheritDoc
 */
qa.ext.net.Client.prototype.destroy = function() {
  this.__cookieJar.cleanup();
  this.emit('destroy');
};
