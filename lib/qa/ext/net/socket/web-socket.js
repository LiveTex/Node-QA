


/**
 * @constructor
 * @implements {qa.ext.net.socket.ISocket}
 * @extends {events.EventEmitter}
 *
 * @event message
 * @event destroy
 *
 * @param {!Object} options Socket settings.
 */
qa.ext.net.socket.WebSocket = function(options) {
  events.EventEmitter.call(this);

  var self = this;

  /**
   * @type {!protocols.Protocol}
   */
  this.__protocol = new protocols.Rfc6455();

  /**
   * @type {!Array.<string|!Buffer>|!ds.queue.Queue}
   */
  this.__writeQueue = new ds.queue.Queue();

  /**
   * @type {boolean}
   */
  this.__isPaused = true;

  /**
   * @type {boolean}
   */
  this.__isConnected = false;

  /**
   * @type {number}
   */
  this.__port = options['port'] || 80;

  /**
   * @type {string}
   */
  this.__host = options['host'] || '127.0.0.1';

  /**
   * @type {!net.Socket}
   */
  this.__socket = new net.Socket();

  /**
   * @type {string}
   */
  this.__responseHeaders = '';

  /**
   * @param {!Error} error
   */
  this.__handleError = function(error) {
    console.error(error);
  };


  /**
   * Handles connections. Right now - do nothing.
   */
  this.__handleConnection = function() {
    var headers = [
      'GET /chat HTTP/1.1',
      'Host: ws://' + self.__host + ':' + self.__port
    ];
    var handshakeHeaders = {
      'Origin': '',
      'Sec-WebSocket-Protocol': 'chat, superchat',
      'Sec-WebSocket-Version': 13
    };

    self.__socket.write(headers.join('\n'));
    self.__socket.write(self.__protocol.handshake({
      'sec-websocket-key': Date.now()
    }, handshakeHeaders));
  };


  /**
   * @param {!Buffer} chunk
   */
  this.__handleData = function(chunk) {
    var data = chunk;

    if (!self.__isConnected) {
      self.__responseHeaders += chunk.toString();

      var separatorIndex = self.__responseHeaders.indexOf('\r\n\r\n');
      if (separatorIndex !== -1) {
        self.__isConnected = true;
        self.__flush();

        data = new Buffer(self.__responseHeaders.substr(separatorIndex + 4));
      }
    }

    if (self.__isConnected && data.length) {
      var messages = self.__protocol.decodeChunk(data);
      while (messages.length > 0) {
        var message = messages.shift();
        self.__handleMessage(message.type, message.data);
      }
    }
  };


  /**
   *
   */
  this.__handleClose = function() {
    self.__isConnected = false;
    self.__socket.removeAllListeners();
    self.__socket.destroy();
  };

  this.__socket.addListener('connect', this.__handleConnection);
  this.__socket.addListener('data', this.__handleData);
  this.__socket.addListener('close', this.__handleClose);
  this.__socket.addListener('error', this.__handleError);

  this.__socket.connect(this.__port, this.__host);
};

util.inherits(qa.ext.net.socket.WebSocket, events.EventEmitter);


/**
 * @inheritDoc
 */
qa.ext.net.socket.WebSocket.prototype.send = function(message) {
  this.__writeQueue.push(this.__protocol.encode(message));
  this.__flush();
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.WebSocket.prototype.destroy = function() {
  this.emit('destroy');
  this.__socket.destroy();
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.WebSocket.prototype.pause = function() {
  this.__isPaused = true;
};


/**
 * @inheritDoc
 */
qa.ext.net.socket.WebSocket.prototype.resume = function() {
  this.__isPaused = false;
  this.__flush();
};


/**
 *
 */
qa.ext.net.socket.WebSocket.prototype.__flush = function() {
  if (!this.__isPaused && this.__isConnected) {
    while (this.__writeQueue.length > 0) {
      this.__socket.write(this.__writeQueue.shift());
    }
  }
};


/**
 * @param {number} type
 * @param {?string} msg
 */
qa.ext.net.socket.WebSocket.prototype.__handleMessage = function(type, msg) {
  if (type === 0x1 || type === 0x8) {
    if (type === 0x1) {
      this.emit('message', msg);
    } else {
      this.destroy();
    }
  }
};
