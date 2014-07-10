


/**
 * @constructor
 * @extends {events.EventEmitter}
 * @implements {qa.ext.IClient}
 * @param {!Object} options
 * @param {number} pollTimeout
 * @param {number} holdTimeout
 * @param {number} destroyTimeout
 * @param {qa.ext.net.CookieJar=} opt_cookieJar
 *
 * @event message
 */
qa.ext.net.Polling = function(options, pollTimeout, holdTimeout, destroyTimeout,
    opt_cookieJar) {
  events.EventEmitter.call(this);

  /**
   * @type {protocols.WsLike}
   */
  this.__protocol = new protocols.WsLike();

  /**
   * @type {string}
   */
  this.__id = '0';

  /**
   * @type {!qa.ext.net.CookieJar}
   */
  this.__cookieJar = opt_cookieJar || new qa.ext.net.CookieJar();

  /**
   * @type {number}
   */
  this.__pollTimeout = pollTimeout;

  /**
   * @type {number}
   */
  this.__holdTimeout = holdTimeout;

  /**
   * @type {number}
   */
  this.__destroyTimeout = destroyTimeout;

  /**
   * @type {!Object}
   */
  this.__options = options;

  /**
   * @type {qa.ext.net.Client}
   */
  this.__client = new qa.ext.net.Client(this.__cookieJar);

};


util.inherits(qa.ext.net.Polling, events.EventEmitter);


/**
 * @return {!async.Step}
 */
qa.ext.net.Polling.prototype.connect = function() {
  var self = this;
  /**
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  return function(input, complete, cancel) {
    function poll() {
      self.__poll();
    }

    function localComplete(headers, data) {
      var status = headers['status'] || 500;
      if (status < 400) {
        var messages = self.__protocol.decodeChunk(data);
        while (messages.length > 0) {
          var message = messages.shift();
          self.__id = message['data'];
        }
        poll();
        complete(input);
      } else {
        cancel('unable to connect');
      }
    }

    function localCancel(error) {
      cancel(error);
    }

    if (!self.__options.hasOwnProperty('headers') ||
        !(self.__options['headers'] instanceof Object)) {
      self.__options.headers = {};
    }

    var handshakeOptions = util.obj.clone(self.__options);

    handshakeOptions.headers['x-hold-timeout'] = self.__holdTimeout;
    handshakeOptions.headers['x-destroy-timeout'] = self.__destroyTimeout;
    handshakeOptions.path = self.__getPath();

    self.__client.request(
        self.__cookieJar.populateCookieHeaders(handshakeOptions),
        '', localComplete, localCancel);
  }
};


/**
 */
qa.ext.net.Polling.prototype.__poll = function() {
  var self = this;
  var options = util.obj.clone(this.__options);
  options.path = this.__getPath();

  function localComplete(headers, data) {
    self.__handleData(headers, data);
  }

  function localCancel(error) {
    console.log(error);
  }

  if (this.__id !== '') {
    this.__client.request(
        this.__cookieJar.populateCookieHeaders(options),
        '', localComplete, localCancel);
  }
};


/**
 * @param {!Object} headers
 * @param {string} data
 */
qa.ext.net.Polling.prototype.__handleData = function(headers, data) {
  var self = this;
  function poll() {
    self.__poll();
  }

  var status = headers['status'] || 500;
  if (status < 400) {
    if (typeof data === 'string' && data.length > 0) {
      var messages = this.__protocol.decodeChunk(data);
      while (messages.length > 0) {
        var message = messages.shift();
        this.__handleMessage(message);
      }
    }

    setTimeout(poll, this.__pollTimeout);

  } else {
    this.destroy();
  }
};


/**
 */
qa.ext.net.Polling.prototype.__handleError = function() {
  console.log('error');
};


/**
 * @inheritDoc
 */
qa.ext.net.Polling.prototype.destroy = function() {
  this.__id = '';
  this.__cookieJar.cleanup();
  this.emit('destroy');
  this.__client.destroy();
};


/**
 * @return {string}
 */
qa.ext.net.Polling.prototype.__getPath = function() {
  return '/poll/' + this.__id + '/' + (new Date()).getTime();
};


/**
 * @param {protocols.Message} message
 */
qa.ext.net.Polling.prototype.__handleMessage = function(message) {
  if (message.type === protocols.WsLike.TEXT_CODE) {
    this.emit('message', message.data);
  }
};
