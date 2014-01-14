


/**
 * @constructor
 * @extends {events.EventEmitter}
 *
 * @event message
 * @event destroy
 */
qa.ext.net.socket.Wrapper = function() {
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

util.inherits(qa.ext.net.socket.Wrapper, events.EventEmitter);


/**
 *
 */
qa.ext.net.socket.Wrapper.prototype.pause = function() {
  this.__isPaused = true;
};


/**
 *
 */
qa.ext.net.socket.Wrapper.prototype.resume = function() {
  this.__flush();
  this.__isPaused = false;
};


/**
 * @param {string} message Сообщение.
 */
qa.ext.net.socket.Wrapper.prototype.send = function(message) {
  if (this.__isPaused) {
    this.__pauseBuffer.push(message);
  } else {
    this.emit('message', message);
  }
};


/**
 *
 */
qa.ext.net.socket.Wrapper.prototype.destroy = function() {
  if (this.__isPaused) {
    this.__isClosed = true;
  } else {
    this.emit('destroy');
  }
};


/**
 *
 */
qa.ext.net.socket.Wrapper.prototype.__flush = function() {
  if (this.__pauseBuffer.length > 0) {
    this.emit('message', this.__pauseBuffer.join(''));
    this.__pauseBuffer.length = 0;
  }

  if (this.__isClosed) {
    this.emit('destroy');
  }
};
