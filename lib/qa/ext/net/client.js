


/**
 * @constructor
 */
qa.ext.net.Client = function() {};


/**
 * @param {!Object} options Параметры запроса.
 * @param {string} payload Данные запроса.
 * @param {function(!Object, string)} complete Обработик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошиюки.
 */
qa.ext.net.Client.prototype.request =
    function(options, payload, complete, cancel) {

  /**
   * @param {!http.ServerResponse} response Объетк ответа.
   */
  function responseHandler(response) {
    var data = '';

    response.addListener('data', function(chunk) {
      data += chunk;
    });

    response.addListener('end', function() {
      response.removeAllListeners();

      complete({
        'status': response.statusCode,
        'headers': response.headers
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

  var request = http.request(options);
  request.addListener('response', responseHandler);
  request.addListener('error', errorHandler);
  request.end(payload);
};


/**
 * @param {!Object} options Параметры соединения.
 * @return {!qa.ext.net.socket.AbstractSocket} Созданный сокет.
 */
qa.ext.net.Client.prototype.createSocket = function(options) {
  return new qa.ext.net.socket.AbstractSocket();
};
