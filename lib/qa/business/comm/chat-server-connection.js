


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {string} host Chat server address/name.
 * @param {number=} opt_port Chat server port.
 */
qa.business.comm.ChatServerConnection = function(host, opt_port) {
  var slave = new ts.Slave(opt_port || 1278, host);
  slave.addListener('error', console.error);

  /**
   * @type {ts.IConnection}
   */
  this.__connection = null;

  /**
   * @type {!Object.<string, ds.queue.Queue>}
   */
  this.__callbacks = {};
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.connect = function() {
  if (this.__connection === null) {
    var connection = new ts.FakeConnection();

    connection.addListener('data', this.__handleData);

    connection.addListener('close', function() {
      connection.removeAllListeners();
    });

    this.__connection = connection;
  }
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.destroy = function() {
  if (this.__connection !== null) {
    this.__connection.destroy();
  }
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.write = function(payload) {
  if (this.__connection !== null) {
    this.__connection.write(payload);
  }
};


/**
 * @param {qa.business.comm.Message} message Request message.
 * @param {function(qa.business.comm.Message)} complete One-time callback
 *   for request`s response.
 * @param {function(string, number)} cancel Error handler.
 * @param {string=} opt_callbackType Request type for callback.
 */
qa.business.comm.ChatServerConnection.prototype.request =
    function(message, complete, cancel, opt_callbackType) {
  var self = this;
  var type = message.getType();

  function callback(data) {
    self.__callbacks[type].remove(callback);

    var code = 0;
    if (typeof data['errno'] === 'number') {
      code = data['errno'];
    }

    if (code === 0) {
      complete(data);
    } else {
      cancel(data['errtext'], code);
    }
  }

  this.setCallback(opt_callbackType || type, callback);
  this.__connection.write(message.encode());
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.setCallback =
    function(type, callback) {
  if (this.__callbacks[type] === undefined) {
    this.__callbacks[type] = new ds.queue.Queue();
  }

  this.__callbacks[type].push(callback);
};


/**
 * @param {string} data Received data.
 */
qa.business.comm.ChatServerConnection.prototype.__handleData = function(data) {
  var response = qa.business.comm.ChatServerResponse.decode(data);
  if (response !== null) {
    var callbacks = this.__callbacks[response.getType()];
    if (callbacks !== undefined && callbacks.length > 0) {
      for (var i = 0, l = callbacks.length; i < l; i += 1) {
        callbacks[i](response);
      }
    }
  }
};
