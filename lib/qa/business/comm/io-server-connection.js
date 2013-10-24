


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {string} host Chat server address/name.
 * @param {number=} opt_port server port.
 */
qa.business.comm.IoServerConnection = function(host, opt_port) {
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
 * @param {qa.business.comm.Message} request Request.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.comm.IoServerConnection.prototype.request =
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
qa.business.comm.IoServerConnection.prototype.write = function(payload) {};


/**
 * Connects channel.
 */
qa.business.comm.IoServerConnection.prototype.connect = function() {};


/**
 * Destroys channel.
 */
qa.business.comm.IoServerConnection.prototype.destroy = function() {};
