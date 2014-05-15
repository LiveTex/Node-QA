


/**
 *
 * Конструктор объекта осуществляющего доступ к selenium WireProtocol
 *
 * @param {string=} opt_seleniumHostname hostname of selenium server
 * @param {string=} opt_seleniumPort port of selenium server
 * @constructor
 */
qa.ext.ui.Browser = function(opt_seleniumHostname, opt_seleniumPort) {

  this.__DEFAULT_BROWSER_SETTINGS = {
    'browserName' : 'firefox',
    'javascriptEnabled' : true
  };

  this.__DEFAULT_SELENIUM_CONFIG = {
    port: 4444,
    hostname: '127.0.0.1',
    path: '/wd/hub'
  };

  this.__seleniumSettings = this.__DEFAULT_SELENIUM_CONFIG;

  if (typeof opt_seleniumHostname !== 'undefined') {
    this.__seleniumSettings.hostname = opt_seleniumHostname;
  }

  if (typeof opt_seleniumPort !== 'undefined') {
    this.__seleniumSettings.port = opt_seleniumPort;
  }

  this.__sessionId = '';


};


/**
 * Метод создающий окно браузера по имени браузера.
 * Допустимые имена браузеров -
 * {chrome|firefox|htmlunit|internet explorer|iphone}.
 * По умолчанию - FF (Имеет встроенный драйвер, не требует доп настройки).
 * @param {string=} opt_browserName browser name
 * @return {!async.Sequence}
 */
qa.ext.ui.Browser.prototype.createSession = function(opt_browserName) {

  var self = this;

  var browserSetting = this.__DEFAULT_BROWSER_SETTINGS;

  if (typeof opt_browserName !== 'undefined') {
    this.__DEFAULT_BROWSER_SETTINGS.browserName = opt_browserName;
  }

  var httpClient = new qa.ext.net.Client();
  var payload = {'desiredCapabilities': browserSetting };

  return function(input, complete, cancel) {

    function localComplete(data, response) {

      httpClient.destroy();

      var decodedResponse = util.decodeJson(response);

      if (decodedResponse !== null) {

        if (decodedResponse.status === 0) {
          this.__sessionId = decodedResponse.sessionId;
          complete(true);
        } else {
          console.log('Error of creating session: returned status is [' +
              decodedResponse.status + ']');
          complete(false);
        }
      } else {
        complete(false);
      }

    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'POST';
    seleniumSettings.path += '/session';

    if (this.__sessionId !== null) {
      httpClient.request(seleniumSettings, util.encodeJson(payload),
          localComplete, cancel);
    } else {
      console.log('Error of creating session: Already have session');
      complete(false);
    }

  }
};


/**
 * Уничтожает окно браузера.
 * @return {!async.Sequence}
 */
qa.ext.ui.Browser.prototype.destroySession = function() {

  var self = this;
  var httpClient = new qa.ext.net.Client();

  return function(input, complete, cancel) {

    function localComplete(data) {

      if (typeof data.status != 'undefined' && data.status == 204) {
        httpClient.destroy();
        complete(true);
      } else {
        complete(false);
      }
    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'DELETE';
    seleniumSettings.path = seleniumSettings.path + '/session/' +
        this.__sessionId;

    httpClient.request(seleniumSettings, '{}',
        localComplete, cancel);

  }
};


/**
 * Функция задающая внутренние задержки в Selenium.
 * Допустимые варианты type - (implicit|script).
 * Implicit - таймаут на поиск элементов.
 * Script - Set the amount of time, in milliseconds,
 * that asynchronous scripts executed by
 * /session/:sessionId/execute_async are permitted to run
 * before they are aborted and a |Timeout| error is returned to the client.
 * @param {String} type Type of timeout (implicit|script)
 * @param {Number} time Time in ms.
 * @return {Function}
 */
qa.ext.ui.Browser.prototype.setTimeout = function(type, time) {

  var self = this;
  var httpClient = new qa.ext.net.Client();

  var payload = {
    type: type,
    ms: time
  };

  return function(input, complete, cancel) {

    function localComplete(data) {

      if (typeof data.status != 'undefined' && data.status == 204) {
        httpClient.destroy();
        complete(true);
      } else {
        complete(false);
      }
    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'POST';
    seleniumSettings.path = seleniumSettings.path + '/session/' +
        this.__sessionId + '/timeouts';

    httpClient.request(seleniumSettings, util.encodeJson(payload),
        localComplete, cancel);
  }

};


/**
 * Устанавливает URL в окне браузера.
 * @param {String} url Url for browser.
 * @return {!async.Sequence}
 */
qa.ext.ui.Browser.prototype.setUrl = function(url) {

  var self = this;
  var httpClient = new qa.ext.net.Client();
  var payload = {url: url};

  return function(input, complete, cancel) {

    function localComplete(data) {

      if (typeof data.status != 'undefined' && data.status == 204) {
        httpClient.destroy();
        complete(true);
      } else {
        complete(false);
      }
    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'POST';
    seleniumSettings.path = seleniumSettings.path + '/session/' +
        this.__sessionId + '/url';

    httpClient.request(seleniumSettings, util.encodeJson(payload),
        localComplete, cancel);
  }

};


/**
 * Метод для поиска элемента на странице.
 * Доступные strategy -
 * ("class name"|"css selector"|"id"|"name"|"link text"
 * |"partial link text"|"tag name"|"xpath")
 * !! Передает в следующий шае ID найденного элемента !!
 * @param {String} strategy Search strategy.
 * @param {String} query Search query.
 * @return {!async.Sequence}
 */
qa.ext.ui.Browser.prototype.findElement = function(strategy, query) {

  var self = this;
  var httpClient = new qa.ext.net.Client();
  var payload = {
    using: strategy,
    value: query
  };

  return function(input, complete, cancel) {

    function localComplete(data, response) {

      var decodedResponse = util.decodeJson(response);

      if (decodedResponse !== null) {

        if (decodedResponse.status === 0) {
          this.__lastFindElement = decodedResponse['value'].ELEMENT;
          complete(this.__lastFindElement);
        } else {
          console.log('Error of finding element: returned status is [' +
              decodedResponse.status + ']');
          complete(false);
        }
      } else {
        complete(false);
      }
    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'POST';
    seleniumSettings.path = seleniumSettings.path + '/session/' +
        this.__sessionId + '/element';

    httpClient.request(seleniumSettings, util.encodeJson(payload),
        localComplete, cancel);
  }
};


/**
 * Метод для взаимодействия с найденным элементом.
 * Принимает ID от предыдущего шага.
 * Доступные методы - (click|submit|value|clear)
 * Опционально - value для установки value элемента
 * @param {String} method Method of action (click|submit|value|clear).
 * @param {String=} opt_value Value of element for value method =).
 * @return {!async.Sequence}
 */
qa.ext.ui.Browser.prototype.produceElementAction = function(method, opt_value) {
  var self = this;
  var httpClient = new qa.ext.net.Client();
  var payload = {value: ''};

  if (typeof opt_value !== 'undefined') {
    payload.value = [opt_value];
  }


  return function(input, complete, cancel) {

    function localComplete(data, response) {

      if (typeof data.status != 'undefined' && data.status == 204) {
        httpClient.destroy();
        complete(input);
      } else {
        complete(input);
      }

    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'POST';
    seleniumSettings.path = seleniumSettings.path + '/session/' +
        this.__sessionId + '/element/' + input + '/' + method;

    httpClient.request(seleniumSettings, util.encodeJson(payload),
        localComplete, cancel);
  }
};


/**
 * Метод для получения данных об элементе.
 * Принимает ID от предыдущего шага.
 * Доступные методы -
 * (text|name|selected|enabled|attribute|displayed|location|size)
 * @param {String} type Type of data
 * @param {String=} opt_attributeName AttributeName for attribute
 * @return {!async.Sequence}
 */
qa.ext.ui.Browser.prototype.getElementData = function(type, opt_attributeName) {
  var self = this;
  var httpClient = new qa.ext.net.Client();
  var payload = {value: ''};

  return function(input, complete, cancel) {

    function localComplete(data, response) {
      var decodedResponse = util.decodeJson(response);

      if (typeof data.status !== 'undefined' && data.status == 200) {

        if (decodedResponse !== null) {

          if (decodedResponse.status === 0) {
            complete(decodedResponse['value']);
          } else {
            console.log('Error of getting element info : returned status is [' +
                decodedResponse.status + ']');
            complete(null);
          }
        } else {
          complete(null);
        }
      }
    }

    var seleniumSettings = util.clone(self.__seleniumSettings);
    seleniumSettings.method = 'GET';

    if (type != 'attribute') {
      seleniumSettings.path = seleniumSettings.path + '/session/' +
          this.__sessionId + '/element/' + input + '/' + type;
    } else {
      seleniumSettings.path = seleniumSettings.path + '/session/' +
          this.__sessionId + '/element/' + input + '/' + type + '/' +
          opt_attributeName;
    }

    httpClient.request(seleniumSettings, util.encodeJson(payload),
        localComplete, cancel);
  }
};

