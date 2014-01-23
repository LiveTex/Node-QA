


/**
 * @constructor
 * @implements {qa.ext.net.socket.ISocket}
 * @extends {events.EventEmitter}
 *
 * @event message
 * @event destroy
 */
qa.ext.net.socket.EchoSocket = function() {
  events.EventEmitter.call(this);

  /**
   * @type {!Array.<string>}
   */
  this.__pauseBuffer = [];

  /**
   * @type {boolean}
   */
  this.__isClosed = false;

  /**
   * @type {boolean}
   */
  this.__isPaused = true;
};

util.inherits(qa.ext.net.socket.EchoSocket, events.EventEmitter);


/**
 * @inheritDoc
 */
qa.ext.net.socket.EchoSocket.prototype.connect = function(opt_options) {};


/**
 * @inheritDoc
 */
qa.ext.net.socket.EchoSocket.prototype.pause = function() {
  this.__isPaused = true;
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.EchoSocket.prototype.resume = function() {
  this.__flush();
  this.__isPaused = false;
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.EchoSocket.prototype.send = function(message) {
  if (this.__isPaused) {
    this.__pauseBuffer.push(message);
  } else {
    this.emit('message', message);
  }
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.EchoSocket.prototype.destroy = function() {
  if (this.__isPaused) {
    this.__isClosed = true;
  } else {
    this.emit('destroy');
  }
};


/**
 *
 */
qa.ext.net.socket.EchoSocket.prototype.__flush = function() {
  if (this.__pauseBuffer.length > 0) {
    this.emit('message', this.__pauseBuffer.join(''));
    this.__pauseBuffer.length = 0;
  }

  if (this.__isClosed) {
    this.emit('destroy');
  }
};
