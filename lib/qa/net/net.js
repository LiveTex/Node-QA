

/**
 * @this {qa.Case}
 * @param {string} method Метод.
 * @param {string} host Адрес.
 * @param {string} path Путь.
 * @param {!Object.<string, string>} headers Заголовки.
 * @param {string} data Данные.
 * @param {function(string)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
 * @param {string=} opt_statusSavePath Путь сохранения результата.
 * @param {string=} opt_headersSavePath Декодер резульатата.
 */
qa.net.request = function(method, host, path, headers, data, complete, cancel,
                          opt_statusSavePath, opt_headersSavePath) {
  var testCase = this;

  /**
   * @param {!http.ServerResponse} response Объетк ответа.
   */
  function responseHandler(response) {
    var body = '';
    var headers = response.headers;

    if (headers['set-cookie'] !== undefined) {
      testCase.setCookie(host, headers['set-cookie'].join(';'));
    }

    if (opt_statusSavePath !== undefined) {
      (new qa.db.Path(opt_statusSavePath)).set(testCase, response.statusCode);
    }

    if (opt_headersSavePath !== undefined) {
      (new qa.db.Path(opt_headersSavePath)).set(testCase, headers);
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

  /**
   * @param {!Error} error Ошибка.
   */
  function errorHandler(error) {
    request.removeAllListeners();
    cancel(error.message);
  }

  var cookie = testCase.getCookie(host);
  if (cookie.length > 0) {
    headers['cookie'] = cookie;
  }

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
