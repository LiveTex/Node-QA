


/**
 * @constructor
 * @implements {async.input.IIterator}
 * @param {!qa.ext.net.socket.AbstractSocket} socket Сокет.
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
    self.__messages.push(message);
    self.__flush();
  };

  /**
   *
   */
  this.__destroyHandler = function() {
    self.__messages.push(undefined);
    self.__flush();
  };

  /**
   * @type {!qa.ext.net.socket.AbstractSocket}
   */
  this.__socket = socket;
  this.__socket.addListener('message', this.__messageHandler);
  this.__socket.addListener('destroy', this.__destroyHandler);
};


/**
 *
 */
qa.ext.net.socket.MessageIterator.prototype.__flush = function() {
  while (this.__messages.length > 0 && this.__callbacks.length > 0) {
    this.__callbacks.shift()(this.__messages.shift());
  }
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.MessageIterator.prototype.next = function(callback) {
  this.__callbacks.push(callback);
  this.__flush();
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
