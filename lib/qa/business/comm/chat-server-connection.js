


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {string} host Chat server address/name.
 * @param {number=} opt_port Chat server port.
 */
qa.business.comm.ChatServerConnection = function(host, opt_port) {
  var slave = new ts.Slave();
  slave.addListener('error', console.error);
  slave.connect(opt_port || 1278, host);

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
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.request =
    function(request, complete, cancel, opt_callbackType) {
  var self = this;
  var type = request.getType();

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
  this.__connection.write(request.getData());
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
