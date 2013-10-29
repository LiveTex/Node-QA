


/**
 * @implements {qa.business.io.IConnection}
 * @constructor
 * @param {!ts.Slave} slave Chat server slave.
 */
qa.business.io.ChatServerConnection = function(slave) {

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
   * @type {!qa.business.io.ChatServerProtocol}
   */
  this.__protocol = new qa.business.io.ChatServerProtocol();

  /**
   * @type {!ts.Slave}
   */
  this.__slave = slave;

  var self = this;

  function handleData(payload) {
    var data = self.__protocol.decode(payload);
    if (data !== null) {
      var callbacks = self.__callbacks[self.__protocol.decodeType(payload)];
      if (callbacks !== undefined && callbacks.length > 0) {
        callbacks.map(function(callback) {
          callback(data);
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
qa.business.io.ChatServerConnection.prototype.destroy = function() {
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
qa.business.io.ChatServerConnection.prototype.write = function(type, data) {
  if (this.__connection !== null) {
    this.__connection.write(this.__protocol.encode(type, data));
  }
};


/**
 * @inheritDoc
 */
qa.business.io.ChatServerConnection.prototype.request =
    function(type, data, complete, cancel, opt_callbackType) {
  function callback(message) {
    self.__callbacks[type].remove(item);

    if (message !== null) {
      complete(message);
    } else {
      cancel('No message received.');
    }
  }

  var self = this;

  var item = this.setCallback(opt_callbackType || type, callback);
  this.write(type, data);
};


/**
 * @inheritDoc
 */
qa.business.io.ChatServerConnection.prototype.setCallback =
    function(type, callback) {
  if (this.__callbacks[type] === undefined) {
    this.__callbacks[type] = new ds.queue.Queue();
  }

  return this.__callbacks[type].push(callback);
};


/**
 * @inheritDoc
 */
qa.business.io.ChatServerConnection.prototype.removeCallback =
    function(type, callbackItem) {
  var callbacks = this.__callbacks[type];
  if (callbacks !== undefined && callbacks.length > 0) {
    callbacks.remove(callbackItem);
  }
};
