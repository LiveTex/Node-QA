


/**
 * @constructor
 * @implements {async.input.IIterator}
 * @param {!qa.ext.net.socket.Wrapper} socket Сокет.
 */
qa.ext.net.socket.MessageIterator = function(socket) {
  var self = this;

  /**
   * @type {!Array.<string|undefined>}
   */
  this.__messages = [];

  /**
   * @type {!Array.<function(async.Input=)>}
   */
  this.__callbacks = [];

  /**
   * @param {string} message Сообщение.
   */
  this.__messageHandler = function(message) {
    if (self.__callbacks.length > 0) {
      self.__callbacks.shift()([message]);
    } else {
      self.__messages.push(message);
    }
  };

  /**
   *
   */
  this.__destroyHandler = function() {
    while (self.__callbacks.length > 0) {
      self.__callbacks.shift();
    }

    self.destroy();
  };

  /**
   * @type {!qa.ext.net.socket.Wrapper}
   */
  this.__socket = socket;
  this.__socket.addListener('message', this.__messageHandler);
  this.__socket.addListener('destroy', this.__destroyHandler);
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.MessageIterator.prototype.next = function(callback) {
  if (this.__messages.length > 0) {
    var chunk = this.__messages.slice(0);
    this.__messages.length = 0;

    callback(chunk);
  } else {
    this.__callbacks.push(callback);
  }
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.MessageIterator.prototype.destroy = function() {
  this.__socket.removeListener('message', this.__messageHandler);
  this.__socket.removeListener('destroy', this.__destroyHandler);

  this.__callbacks.length = 0;
  this.__messages.length = 0;
};
