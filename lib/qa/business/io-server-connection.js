


/**
 * @implements {qa.business.IConnection}
 * @constructor
 * @param {string} host Chat server address/name.
 * @param {number=} opt_port server port.
 */
qa.business.IoServerConnection = function(host, opt_port) {
  /**
   * @type {!string}
   */
  this.__host = host;

  /**
   * @type {ts.IConnection}
   */
  this.__connection = null;

  /**
   * @type {!Object.<string, ds.queue.Queue>}
   */
  this.__callbacks = {};

  /**
   * @type {number=}
   */
  this.__port = opt_port || 80;
};


/**
 * @param {qa.business.Request} request Request.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.IoServerConnection.prototype.request =
    function(request, complete, cancel) {
  var options = {
    host: this.__host,
    port: this.__port,
    path: request.getPath(),
    method: 'GET'
  };

  http.get(options, function(res) {
    if (res.statusCode === '200') {
      res.on('data', function(chunk) {
        complete(chunk);
      });
    } else {
      cancel('HTTP error', res.statusCode);
    }
  }).on('error', function(e) {
    cancel('Got HTTP error: ' + e.message, null);
  });
};


/**
 * @param {string} payload Message.
 */
qa.business.IoServerConnection.prototype.write = function(payload) {};


/**
 * Connects channel.
 */
qa.business.IoServerConnection.prototype.connect = function() {};


/**
 * Destroys channel.
 */
qa.business.IoServerConnection.prototype.destroy = function() {};
