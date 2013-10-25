


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
   * @type {!Object.<string, ds.queue.Queue>}
   */
  this.__callbacks = {};

  /**
   * @type {number}
   */
  this.__port = opt_port || 80;
};


/**
 * @inheritDoc
 */
qa.business.comm.IoServerConnection.prototype.request =
    function(message, complete, cancel, opt_callbackType) {
  var options = {
    host: this.__host,
    port: this.__port,
    path: message.getData(),
    method: 'GET'
  };

  http.get(options, function(res) {
    if (res.statusCode === 200) {
      res.on('data', function(chunk) {
        complete(qa.business.comm.AuthIoServerResponse.decode(
            chunk.toString()));
      });
    } else {
      cancel('HTTP error', res.statusCode);
    }
  }).on('error', function(e) {
    cancel('Got HTTP error: ' + e.message);
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


/**
 * Sets callback for an event.
 * @param {string} event Event type.
 * @param {function(qa.business.comm.Message)} callback Event listener.
 */
qa.business.comm.IoServerConnection.prototype.setCallback =
    function(event, callback) {};


/**
 * @param {string} type Callback type.
 * @param {!ds.queue.QueueItem} callbackItem Callback item
 *   (returned by setCallback).
 */
qa.business.comm.IoServerConnection.prototype.removeCallback =
    function(type, callbackItem) {};
