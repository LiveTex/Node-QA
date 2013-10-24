


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {!ts.Slave} slave Chat server slave.
 */
qa.business.comm.ChatServerConnection = function(slave) {

  /**
   * @type {!ts.Slave}
   */
  this.__slave = slave;

  /**
   * @type {ts.IConnection}
   */
  this.__connection = null;

  /**
   * @type {!Object.<string, (Array.<function()>|!ds.queue.Queue)>}
   */
  this.__callbacks = {};
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.connect = function() {
  var self = this;

  function handleData(data) {
    var response = qa.business.comm.ChatServerResponse.decode(data);
    if (response !== null) {
      var callbacks = self.__callbacks[response.getType()];
      if (callbacks !== undefined && callbacks.length > 0) {
        callbacks.map(function(callback) {
          callback(response);
        });
      }
    }
  }

  if (this.__connection === null) {
    var connection = new ts.FakeConnection();

    connection.addListener('data', handleData);
    connection.addListener('close', function() {
      connection.removeAllListeners();
    });

    this.__slave.attachConnection(connection.getReceiver());
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
  function callback(data) {
    console.log(self.__callbacks[type]);
    self.__callbacks[type].remove(item);

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

  var self = this;
  var type = message.getType();

  var item = this.setCallback(opt_callbackType || type, callback);
  this.write(message.encode());
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.setCallback =
    function(type, callback) {
  if (this.__callbacks[type] === undefined) {
    this.__callbacks[type] = new ds.queue.Queue();
  }

  return this.__callbacks[type].push(callback);
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.removeCallback =
    function(type, callbackItem) {
  var callbacks = this.__callbacks[type];
  if (callbacks !== undefined && callbacks.length > 0) {
    callbacks.remove(callbackItem);
  }
};
