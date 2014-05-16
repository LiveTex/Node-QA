


/**
 *
 * Конструктор объекта осуществляющего доступ к selenium WireProtocol
 *
 * @param {string=} opt_seleniumHostname hostname of selenium server
 * @param {string=} opt_seleniumPort port of selenium server
 * @constructor
 */
qa.ext.ui.Browser = function(opt_seleniumHostname, opt_seleniumPort) {

  /**
   * @type {!Object}
   */
  this.__seleniumSettings = {
    port: opt_seleniumPort || 4444,
    hostname: opt_seleniumHostname || '127.0.0.1',
    path: '/wd/hub'
  };

  /**
   * @type {string}
   */
  this.__sessionId = '';

  /**
   * @type {!qa.ext.net.Client}
   */
  this.__httpClient = new qa.ext.net.Client();
};


/**
 * @param {!string} path
 * @param {!string} method
 * @return {!Object}
 */
qa.ext.ui.Browser.prototype.__prepareSeleniumSettings =
    function(path, method) {
  var seleniumSettings = util.obj.clone(this.__seleniumSettings);
  seleniumSettings['method'] = method;
  seleniumSettings['path'] += '/session/' + this.__sessionId + path;
  return seleniumSettings;
};


/**
 * Метод создающий окно браузера по имени браузера.
 * @param {qa.ext.ui.BrowserName=} opt_browserName Browser name
 * @param {qa.ext.ui.Platform=} opt_platform Platform name
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.createSession =
    function(opt_browserName, opt_platform) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function createSession(input, complete, cancel) {

    /**
     * @param {!Object} data
     * @param {!string} response
     */
    function localComplete(data, response) {
      var safeResponse = util.obj.safe(util.decodeJson(response));
      if (safeResponse.get('status') === 0) {
        self.__sessionId = safeResponse.get('sessionId');
        complete(self.__sessionId);
      } else {
        console.log('Error of creating session: returned status is [' +
            safeResponse.get('status') + ']');
        complete(null);
      }
    }

    var seleniumSettings = util.obj.clone(self.__seleniumSettings);
    seleniumSettings['path'] += '/session';
    seleniumSettings['method'] = 'POST';

    if (self.__sessionId !== null) {
      self.__httpClient.request(seleniumSettings, util.encodeJson(
          {'desiredCapabilities':
                {
                  'browserName' : opt_browserName || qa.ext.ui.BrowserName.FF,
                  'platform' : opt_platform || qa.ext.ui.Platform.ANY,
                  'javascriptEnabled' : true
                }
          }), localComplete, cancel);
    } else {
      console.log('Error of creating session: Already have session');
      complete(null);
    }
  }
  return createSession;
};


/**
 * Уничтожает окно браузера.
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.destroySession = function() {
  var self = this;

  /**
   * @this {async.Context}
   * @param {async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function destroySession(input, complete, cancel) {

    /**
     * @param {!Object} data
     */
    function localComplete(data) {
      self.__sessionId = '';
      if (data['status'] === 204) {
        complete(true);
      } else {
        complete(false);
      }
    }
    var seleniumSettings =
        self.__prepareSeleniumSettings('', 'DELETE');
    self.__httpClient.request(seleniumSettings, '{}',
        localComplete, cancel);
  }
  return destroySession;
};


/**
 * Функция задающая внутренние задержки в Selenium.
 * Допустимые варианты type - (implicit|script).
 * Implicit - таймаут на поиск элементов.
 * Script - Set the amount of time, in milliseconds,
 * that asynchronous scripts executed by
 * /session/:sessionId/execute_async are permitted to run
 * before they are aborted and a |Timeout| error is returned to the client.
 * @param {!qa.ext.ui.Timeout} type Type of timeout (implicit|script)
 * @param {!Number} time Time in ms.
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.setTimeout = function(type, time) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function setTimeout(input, complete, cancel) {

    /**
     * @param {!Object} data
     */
    function localComplete(data) {
      if (data['status'] === 204) {
        complete(true);
      } else {
        complete(false);
      }
    }
    var payload = {
      type: type,
      ms: time
    };
    var seleniumSettings = self.__prepareSeleniumSettings('/timeouts', 'POST');
    self.__httpClient.request(seleniumSettings, util.encodeJson(
        {
          type: type,
          ms: time
        }), localComplete, cancel);
  }
  return setTimeout;
};


/**
 * Устанавливает URL в окне браузера.
 * @param {!String} url Url for browser.
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.setUrl = function(url) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function setUrl(input, complete, cancel) {

    /**
     * @param {!Object} data
     */
    function localComplete(data) {
      if (data['status'] === 204) {
        complete(true);
      } else {
        complete(false);
      }
    }
    var seleniumSettings = self.__prepareSeleniumSettings('/url', 'POST');
    self.__httpClient.request(seleniumSettings, util.encodeJson({url: url}),
        localComplete, cancel);
  }
  return setUrl;
};


/**
 * Метод для поиска элемента на странице.
 * Доступные strategy -
 * ("class name"|"css selector"|"id"|"name"|"link text"
 * |"partial link text"|"tag name"|"xpath")
 * !! Передает в следующий шае ID найденного элемента !!
 * @param {!qa.ext.ui.SearchStrategy} strategy Search strategy.
 * @param {!String} query Search query.
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.findElement = function(strategy, query) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function findElement(input, complete, cancel) {

    /**
     * @param {!Object} data
     * @param {!string} response
     */
    function localComplete(data, response) {
      var safeResponse = util.obj.safe(util.decodeJson(response));
      if (safeResponse.get('status') === 0) {
        complete((safeResponse.get('value', 'ELEMENT')));
      } else {
        console.log('Error of finding element: returned status is [' +
            safeResponse.get('status') + ']');
        complete(null);
      }
    }
    var seleniumSettings =
        self.__prepareSeleniumSettings('/element', 'POST');
    self.__httpClient.request(seleniumSettings, util.encodeJson(
        {
          using: strategy,
          value: query
        }), localComplete, cancel);
  }
  return findElement;
};


/**
 * Метод для взаимодействия с найденным элементом.
 * Принимает ID от предыдущего шага.
 * Доступные методы - (click|submit|value|clear)
 * Опционально - value для установки value элемента
 * @param {!qa.ext.ui.ActionMethod} method Method of action
 * @param {String=} opt_value Value of element for value method =).
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.produceElementAction = function(method, opt_value) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {!async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function produceElementAction(input, complete, cancel) {

    /**
     * @param {!Object} data
     */
    function localComplete(data) {
      if (data['status'] === 204) {
        complete(input);
      } else {
        complete(input);
      }
    }
    var seleniumSettings = self.__prepareSeleniumSettings('/element/' + input +
        '/' + method, 'POST');
    self.__httpClient.request(seleniumSettings, util.encodeJson(
        {
          value: [opt_value] || ''
        }), localComplete, cancel);
  }
  return produceElementAction;
};


/**
 * Метод для получения данных об элементе.
 * Принимает ID от предыдущего шага.
 * Доступные методы -
 * (text|name|selected|enabled|attribute|displayed|location|size)
 * @param {!qa.ext.ui.Element} type Type of data
 * @param {String=} opt_attributeName AttributeName for attribute
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.getElementData = function(type, opt_attributeName) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {!async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function getElementData(input, complete, cancel) {

    /**
     * @param {!Object} data
     * @param {!string} response
     */
    function localComplete(data, response) {
      var safeResponse = util.obj.safe(util.decodeJson(response));
      if (data['status'] === 200) {
        if (safeResponse.get('status') === 0) {
          complete(safeResponse.get('value'));
        } else {
          console.log('Error of getting element info : returned status is [' +
              safeResponse.get('status') + ']');
          complete(null);
        }
      } else {
        complete(null);
      }
    }
    var seleniumSettings = {};
    if (type !== 'attribute') {
      seleniumSettings = self.__prepareSeleniumSettings('/element/' + input +
          '/' + type, 'GET');
    } else {
      seleniumSettings =
          self.__prepareSeleniumSettings('/element/' + input + '/' + type +
                  '/' + opt_attributeName, 'GET');
    }
    self.__httpClient.request(seleniumSettings, '{}', localComplete, cancel);
  }
  return getElementData;
};

