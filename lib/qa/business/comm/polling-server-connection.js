


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {string} host Chat server address/name.
 * @param {string=} opt_poll Channel name.
 * @param {number=} opt_polling_timeout Polling timeout.
 * @param {number=} opt_port server port.
 */
qa.business.comm.PollingServerConnection =
    function(host, opt_poll, opt_polling_timeout, opt_port) {
  /**
   * @type {string}
   */
  this.__host = host;

  /**
   * @type {number}
   */
  this.__port = opt_port || 80;

  /**
   * @type {string}
   */
  this.__poll = opt_poll || '';

  /**
   * @type {number}
   */
  this.__polling_timeout = opt_polling_timeout || 1000;

  /**
   * @type {number}
   */
  this.__pollTimer = 0;
};


/**
 * @param {string} payload Message.
 */
qa.business.comm.PollingServerConnection.prototype.write = function(payload) {};


/**
 * Connects channel.
 */
qa.business.comm.PollingServerConnection.prototype.connect = function() {
  var self = this;
  function callback() {
    self.__pollTimer = setTimeout(self.connect, self.__polling_timeout);
  }

  http.get({
    host: this.__host,
    port: this.__port,
    path: '/' + this.__poll + '/' + Date.now().toString(),
    timeout: this.__polling_timeout,
    method: 'GET'
  }, function(res) {
    console.log(res.statusCode);
    callback();
  }).on('error', function(e) {
    console.log('err', e);
    callback();
  });
};


/**
 * Destroys channel.
 */
qa.business.comm.PollingServerConnection.prototype.destroy = function() {
  clearTimeout(this.__pollTimer);
};


/**
 * @param {qa.business.comm.Message} message Request message.
 * @param {function(qa.business.comm.Message)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.comm.PollingServerConnection.prototype.request =
    function(message, complete, cancel) {};


/**
 * @param {string} poll
 */
qa.business.comm.PollingServerConnection.prototype.setPoll = function(poll) {
  this.__poll = poll;
};
