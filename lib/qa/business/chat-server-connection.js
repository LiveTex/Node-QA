


/**
 * @implements {qa.business.IConnection}
 * @constructor
 * @param {string} host Chat server address/name.
 */
qa.business.ChatServerConnection = function(host) {
  var slave = new ts.Slave();
  slave.addListener('error', console.error);
  slave.connect(1278, host);

  /**
   * @type {ts.IConnection}
   */
  this.__connection = null;

  /**
   * @type {!Object.<string, ds.queue.Queue>}
   */
  this.__callbacks = {};
};


/**
 * @inheritDoc
 */
qa.business.ChatServerConnection.prototype.connect = function() {
  if (this.__connection === null) {
    var connection = new ts.FakeConnection();

    connection.addListener('data', this.__handleData);

    connection.addListener('close', function() {
      connection.removeAllListeners();
    });

    this.__connection = connection;
  }
};


/**
 * @inheritDoc
 */
qa.business.ChatServerConnection.prototype.destroy = function() {
  if (this.__connection !== null) {
    this.__connection.destroy();
  }
};


/**
 * @inheritDoc
 */
qa.business.ChatServerConnection.prototype.write = function(payload) {
  if (this.__connection !== null) {
    this.__connection.write(payload);
  }
};


/**
 * @inheritDoc
 */
qa.business.ChatServerConnection.prototype.request =
    function(request, complete, cancel) {
  var self = this;
  function callback(data) {
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

  var type = request.getType();
  if (this.__callbacks[type] === undefined) {
    this.__callbacks[type] = new ds.queue.Queue;
  }

  this.__callbacks[type].push(callback);
  this.__connection.write(request.getData());
};
