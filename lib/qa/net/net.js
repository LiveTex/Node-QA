
/**
 * @typedef {?function(string):*}
 */
qa.net.ResponseDecoder;


/**
 * @this {qa.test.Context}
 * @param {string} method Метод.
 * @param {string} host Адрес.
 * @param {string} path Путь.
 * @param {!Object.<string, string>} headers Заголовки.
 * @param {string} data Данные.
 * @param {function(http.ServerResponse)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
 * @param {string} opt_savePath Путь сохранения результата.
 * @param {!qa.net.ResponseDecoder} opt_decoder Декодер резульатата.
 */
qa.net.request = function(method, host, path, headers, data, complete, cancel,
                          opt_savePath, opt_decoder) {

  var сontext = this;

  /**
   * @param {http.ServerResponse} response
   * @param {string} savePath
   * @param decoder
   * @param complete
   */
  function saveData(response, savePath, decoder, complete) {
    var body = '';

    response.addListener('data', function(chunk) {
      body += chunk;
    });

    response.addListener('end', function() {
      response.removeAllListeners();

      сontext.getDataNode()

      complete();
    });
  }

  var request = http.request({
    'hostname': host,
    'path': path,
    'method': method,
    'headers': headers
  }, function(response) {
    request.removeAllListeners();



  });

  request.addListener('error', function(error) {
    request.removeAllListeners();

    cancel(error.message);
  });

  request.end(data);
};
