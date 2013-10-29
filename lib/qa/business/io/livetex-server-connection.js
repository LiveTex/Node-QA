


/**
 * @implements {qa.business.io.IConnection}
 * @constructor
 * @param {!qa.business.entity.Visitor} visitor Visitor object.
 * @param {string} host Chat server address/name.
 * @param {function(Object)=} opt_authCallback
 *   Visitor authentication callback.
 * @param {number=} opt_port server port.
 */
qa.business.io.LivetexServerConnection = function(visitor, host,
    opt_authCallback, opt_port) {
  /**
   * @type {!string}
   */
  this.__host = host;

  /**
   * @type {number}
   */
  this.__port = opt_port || 80;

  /**
   * @type {!qa.business.entity.Visitor}
   */
  this.__visitor = visitor;

  /**
   * @type {function(Object)}
   */
  this.__authCallback = opt_authCallback || util.nop;

  /**
   * @type {!qa.business.io.LivetexServerProtocol}
   */
  this.__protocol = new qa.business.io.LivetexServerProtocol();

  /**
   * @type {string}
   */
  this.__pollId = '';

  /**
   * @type {number}
   */
  this.__pollTimer = 0;

  var data = {
    'request': 'auth',
    'session': visitor.getSession(),
    'source': 'visitor',
    'body': visitor.serializeWebAuth()
  };

  var self = this;
  http.get(host + this.__protocol.encode('auth', data), function(res) {
    res.addListener('data', function(buf) {
      if (res.statusCode === 200) {
        var data = buf.toString();
        self.__pollId = self.__protocol.getPollId(data);
        poll();

        self.__authCallback(self.__protocol.decode(data));
      }
    });
  });

  function poll() {
    console.log('poll');
    if (self.__pollId) {
      http.get(host + '/' + self.__pollId + '/' + Date.now(), function(res) {
        res.addListener('data', async.nop);
        self.__pollTimer = setTimeout(poll, 3000);
      });
    }
  }
};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerConnection.prototype.request =
    function(message, complete, cancel, opt_callbackType) {};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerConnection.prototype.write = function(payload) {};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerConnection.prototype.destroy = function() {
  clearTimeout(this.__pollTimer);
  this.__pollTimer = 0;
};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerConnection.prototype.setCallback =
    function(event, callback) {};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerConnection.prototype.removeCallback =
    function(type, callbackItem) {};
