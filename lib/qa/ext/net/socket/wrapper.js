


/**
 * @constructor
 * @implements {qa.ext.IClient}
 * @extends {events.EventEmitter}
 *
 * @event message
 * @event destroy
 *
 * @param {qa.ext.net.socket.ISocket} socket Socket implementation.
 */
qa.ext.net.socket.Wrapper = function(socket) {
  events.EventEmitter.call(this);

  /**
   * @type {qa.ext.net.socket.ISocket}
   */
  this.__socket = socket;

  var self = this;
  this.__socket.addListener('message', function(message) {
    self.emit('message', message);
  });

  this.__socket.addListener('destroy', function(destroy) {
    self.__socket.removeAllListeners();
    self.emit('destroy');
  });
};

util.inherits(qa.ext.net.socket.Wrapper, events.EventEmitter);


/**
 *
 */
qa.ext.net.socket.Wrapper.prototype.pause = function() {
  this.__socket.pause();
};


/**
 *
 */
qa.ext.net.socket.Wrapper.prototype.resume = function() {
  this.__socket.resume();
};


/**
 * @param {string} message Сообщение.
 */
qa.ext.net.socket.Wrapper.prototype.send = function(message) {
  this.__socket.send(message);
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.Wrapper.prototype.destroy = function(opt_force) {
  if (opt_force) {
    this.__socket.resume();
  }

  this.__socket.destroy();
};
