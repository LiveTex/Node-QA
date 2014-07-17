


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
 * @param {string} path
 * @param {string} method
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
 * @param {Object=} opt_capabilities Browser capabilities
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.createSession =
    function(opt_capabilities) {
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
     * @param {string} response
     */
    function localComplete(data, response) {
      var seleniumResponse = new qa.util.SeleniumResponse(response);
      if (seleniumResponse.isOk()) {
        self.__sessionId = seleniumResponse.getSessionId();
        complete(self.__sessionId);
      } else {
        console.log('Error of creating session: returned status is [' +
            seleniumResponse.getStatus() + ']');
        complete(null);
      }
    }

    var seleniumSettings = util.obj.clone(self.__seleniumSettings);
    seleniumSettings['path'] += '/session';
    seleniumSettings['method'] = 'POST';

    var capabilities = opt_capabilities || {};
    capabilities = util.obj.merge({
      'browserName': qa.ext.ui.BrowserName.FIREFOX,
      'platform': qa.ext.ui.Platform.ANY
    }, capabilities);

    if (self.__sessionId !== null) {
      self.__httpClient.request(seleniumSettings, util.encodeJson({
        'desiredCapabilities': capabilities
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
 * @param {number} time Time in ms.
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
    var seleniumSettings = self.__prepareSeleniumSettings('/timeouts', 'POST');
    self.__httpClient.request(seleniumSettings, util.encodeJson({
      type: type,
      ms: time
    }), localComplete, cancel);
  }
  return setTimeout;
};


/**
 * Устанавливает URL в окне браузера.
 * @param {!string} url Url for browser.
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
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.getUrl = function() {
  return this.request('/url/', 'GET', {});
};


/**
 * Метод для поиска элемента на странице.
 * Доступные strategy -
 * ("class name"|"css selector"|"id"|"name"|"link text"
 * |"partial link text"|"tag name"|"xpath")
 * !! Передает в следующий шае ID найденного элемента !!
 * @param {!qa.ext.ui.SearchStrategy} strategy Search strategy.
 * @param {string} query Search query.
 * @param {qa.ext.ui.Element=} opt_element
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.findElement =
    function(strategy, query, opt_element) {
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
     * @param {string} response
     */
    function localComplete(data, response) {
      var seleniumResponse = new qa.util.SeleniumResponse(response);
      if (seleniumResponse.isOk()) {
        complete(seleniumResponse.getValue().get('ELEMENT'));
      } else {
        console.log('Error of finding element: returned status is [' +
            seleniumResponse.getStatus + ']');
        complete(null);
      }
    }

    var seleniumSettings;
    if (typeof opt_element !== 'undefined') {
      seleniumSettings = self.__prepareSeleniumSettings('/element/' +
          opt_element.getId() + '/element/', 'POST');
    } else {
      seleniumSettings = self.__prepareSeleniumSettings('/element', 'POST');
    }

    self.__httpClient.request(seleniumSettings, util.encodeJson({
      using: strategy,
      value: query
    }), localComplete, cancel);
  }
  return findElement;
};


/**
 * @param {!qa.ext.ui.SearchStrategy} strategy Search strategy.
 * @param {string} query Search query.
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.findElements = function(strategy, query) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function findElements(input, complete, cancel) {

    /**
     * @param {!Object} data
     * @param {string} response
     */
    function localComplete(data, response) {
      var seleniumResponse = new qa.util.SeleniumResponse(response);
      if (seleniumResponse.isOk()) {
        var elements = seleniumResponse.getValue();
        var elementIds = [];
        for (var i = 0; i < elements.length; i += 1) {
          var element = util.obj.safe(elements[i]);
          elementIds.push(element.get('ELEMENT'));
        }
        complete(elementIds);
      } else {
        complete(null);
      }
    }
    var seleniumSettings =
        self.__prepareSeleniumSettings('/elements', 'POST');
    self.__httpClient.request(seleniumSettings, util.encodeJson({
      using: strategy,
      value: query
    }), localComplete, cancel);
  }
  return findElements;
};


/**
 * Метод для взаимодействия с найденным элементом.
 * Принимает ID от предыдущего шага.
 * Доступные методы - (click|submit|value|clear)
 * Опционально - value для установки value элемента
 * @param {!qa.ext.ui.ActionMethod} method Method of action
 * @param {string=} opt_value Value of element for value method =).
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
    self.__httpClient.request(seleniumSettings, util.encodeJson({
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
 * @param {!qa.ext.ui.ElementProperty} type Type of data
 * @param {string=} opt_attributeName AttributeName for attribute
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
     * @param {string} response
     */
    function localComplete(data, response) {
      var seleniumResponse = new qa.util.SeleniumResponse(response);
      if (data['status'] === 200) {
        if (seleniumResponse.isOk()) {
          complete(seleniumResponse.getValue());
        } else {
          console.log('Error of getting element info : returned status is [' +
              seleniumResponse.getStatus() + ']');
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


/**
 * @param {string} path
 * @param {string} method
 * @param {!Object} data
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.request = function(path, method, data) {
  var self = this;

  /**
   * @this {async.Context}
   * @param {!async.Input} input
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  return function(input, complete, cancel) {
    /**
     * @param {!Object} data
     * @param {!string} response
     */
    function localComplete(data, response) {
      if (data['status'] === 200) {
        var seleniumResponse = new qa.util.SeleniumResponse(response);
        complete(seleniumResponse.getValue());
      } else {
        complete(null);
      }
    }

    var seleniumSettings = self.__prepareSeleniumSettings(path, method);
    self.__httpClient.request(seleniumSettings, util.encodeJson(data),
        localComplete, cancel);
  }
};


/**
 * @param {string} name
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.window = function(name) {
  return this.request('/window/', 'POST', { name: name });
};


/**
 * @param {?string} frame
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.frame = function(frame) {
  return this.request('/frame/', 'POST', { id: frame });
};


/**
 * @param {string} key
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.localStorage = function(key) {
  return this.request('/local_storage/key/' + key + '/', 'GET', {});
};


/**
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.cookie = function() {
  return this.request('/cookie/', 'GET', {});
};


/**
 * @param {string} script
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.execute = function(script) {
  return this.request('/execute/', 'POST', { script: script, args: [] });
};


/**
 * @param {qa.ext.ui.LogType} type
 * @return {!async.Step}
 */
qa.ext.ui.Browser.prototype.log = function(type) {
  return this.request('/log/', 'POST', { type: type });
};
