


/**
 * @constructor
 * @extends {events.EventEmitter}
 * @implements {qa.ext.IClient}
 *
 * @event message
 */
qa.ext.net.Client = function() {
  events.EventEmitter.call(this);

  /**
   * @type {!qa.ext.net.CookieJar}
   */
  this.__cookieJar = new qa.ext.net.CookieJar();
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
      this.populateCookieHeaders(util.obj.clone(options)));

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
 * @param {!Object} options Опиции запроса.
 * @return {!Object} Опиции запроса расширенные заголовками Cookie.
 */
qa.ext.net.Client.prototype.populateCookieHeaders = function(options) {
  if (options['hostname']) {
    var cookies = this.__cookieJar.getByDomain(options['hostname']);
    var headers = {};
    var cookieHeader = [];

    if (options['headers'] instanceof Object) {
      headers = options['headers'];
    }

    if (typeof headers['Cookie'] === 'string') {
      cookieHeader = [headers['Cookie']];
    }

    for (var i = 0; i < cookies.length; i++) {
      cookieHeader.push(cookies[i].serialize());
    }

    options['headers'] = headers;
    headers['Cookie'] = cookieHeader;
  }

  return options;
};


/**
 * @inheritDoc
 */
qa.ext.net.Client.prototype.destroy = function() {
  this.__cookieJar.cleanup();
  this.emit('destroy');
};
