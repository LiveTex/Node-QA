










qa.util.net.request = function(optionsPath, opt_statusPath, opt_headersPath) {
  var optionsTokens = optionsPath.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function request(data, complete, cancel) {

    /**
     * @param {!Error} error Ошибка.
     */
    function errorHandler(error) {
      request.removeAllListeners();
      cancel(error.message);
    }

    var requestOptions = this.get(optionsTokens);
    var options = {};

    if (requestOptions instanceof Object) {
      options = qa.util.cloneSync(options);

      if (!(options['headers'] instanceof Object)) {
        options['headers'] = {};
      }
    }

    var request = http.request(options);

    request.addListener('response', responseHandler);
    request.addListener('error', errorHandler);
    request.end(data);
  }

  return request;
};



qa.util.net.__populateCookie = function(headers, cursor) {

};




























/**
 * @this {qa.state.Cursor}
 * @param {string} method Метод.
 * @param {string} host Адрес.
 * @param {string} path Путь.
 * @param {string} data Данные.
 * @param {function(string)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
 * @param {string=} opt_metaPath Путь сохранения результата.
 */
qa.util.net.__request = function(method, host, path, data, complete, cancel,
                               opt_inputHeaders) {
  var cursor = this;
  var cookieStorage = this.getCase().getCookieStorage();

  /**
   * @param {!http.ServerResponse} response Объетк ответа.
   */
  function responseHandler(response) {
    var body = '';
    var headers = response.headers;

    for (var i in headers['set-cookie']) {
      cookieStorage.setCookie(host, headers['set-cookie'][i]);
    }

    if (opt_metaPath !== undefined) {
      var metaPath = opt_metaPath.split(qa.state.PATH_SEPARATOR);

      cursor.set(metaPath.concat('status'), response.statusCode);
      cursor.set(metaPath.concat('headers'), headers);
    }

    response.addListener('data', function(chunk) {
      body += chunk;
    });

    response.addListener('end', function() {
      response.removeAllListeners();
      complete(body);
    });

    request.removeAllListeners();
  }

  headers['cookie'] = cookieStorage.getCookie(host, path);

  var request = http.request({
    'hostname': host,
    'path': path,
    'method': method,
    'headers': headers
  });

  request.addListener('response', responseHandler);
  request.addListener('error', errorHandler);
  request.end(data);
};
