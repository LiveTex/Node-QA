


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {!qa.business.app.Application} app Application.
 * @param {string} host Chat server address/name.
 * @param {number=} opt_port Chat server port.
 */
qa.business.comm.ChatServerConnection = function(app, host, opt_port) {
  if (qa.business.comm.ChatServerConnection.__slave === null) {
    qa.business.comm.ChatServerConnection.__slave =
        new ts.Slave(opt_port || 1278, host);
    qa.business.comm.ChatServerConnection.__slave.addListener(
        'error', console.error);
    qa.business.comm.ChatServerConnection.__slave.connect(
        opt_port || 1278, host);
  }

  /**
   * @type {ts.IConnection}
   */
  this.__connection = null;

  /**
   * @type {!Object.<string, (Array.<function()>|!ds.queue.Queue)>}
   */
  this.__callbacks = {};
};


// TODO: move to application
/**
 * @type {ts.Slave}
 */
qa.business.comm.ChatServerConnection.__slave = null;


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
        var iterator = callbacks.getIterator();
        while (iterator.hasNext()) {
          iterator.next().get()(response);
        }
      }
    }
  }

  if (this.__connection === null) {
    var connection = new ts.FakeConnection();

    connection.addListener('data', handleData);

    connection.addListener('close', function() {
      connection.removeAllListeners();
    });

    qa.business.comm.ChatServerConnection.__slave.attachConnection(
        connection.getReceiver());
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
    console.log(self.__callbacks[type]);
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

  this.__callbacks[type].push(callback);
};
