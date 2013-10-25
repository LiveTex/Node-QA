


/**
 * @implements {qa.business.comm.IConnection}
 * @constructor
 * @param {!ts.Slave} slave Chat server slave.
 */
qa.business.comm.ChatServerConnection = function(slave) {

  /**
   * @type {ts.IConnection}
   */
  this.__connection = null;

  /**
   * @type {string}
   */
  this.__connectionDescriptor = '';

  /**
   * @type {!Object.<string, (Array.<function()>|!ds.queue.Queue)>}
   */
  this.__callbacks = {};

  /**
   * @type {!qa.business.comm.ChatServerProtocol}
   */
  this.__protocol = new qa.business.comm.ChatServerProtocol();

  /**
   * @type {!ts.Slave}
   */
  this.__slave = slave;

  var self = this;

  function handleData(data) {
    var message = self.__protocol.decode(data);
    if (message !== null) {
      var callbacks = self.__callbacks[message.getType()];
      if (callbacks !== undefined && callbacks.length > 0) {
        callbacks.map(function(callback) {
          callback(message);
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

    this.__connectionDescriptor =
        slave.attachConnection(connection.getReceiver());
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
  if (this.__connectionDescriptor) {
    this.__slave.detachConnection(this.__connectionDescriptor);
    this.__connectionDescriptor = '';
  }
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.write = function(message) {
  if (this.__connection !== null) {
    this.__connection.write(this.__protocol.encode(message));
  }
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerConnection.prototype.request =
    function(message, complete, cancel, opt_callbackType) {
  function callback(message) {
    self.__callbacks[type].remove(item);

    if (message !== null) {
      complete(message);
    } else {
      cancel('No message received.');
    }
  }

  var self = this;
  var type = message.getType();

  var item = this.setCallback(opt_callbackType || type, callback);
  this.write(message);
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
