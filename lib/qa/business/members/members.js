

//
//  DO NOT LOOK AND USE
//  yet...
//




/**
 * @this {qa.business.Application}
 * @param {string} login Member name.
 * @param {string} password Member password - plain or md5.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.auth = function(login, password, complete,
                                    cancel) {
  var body = {
    'source': 'operator',
    'login': login,
    'password': password
  };

  this.__makeRequest('auth', body, complete, cancel);
};


/**
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.chatList = function(complete, cancel) {
  this.__makeRequest('chat_list', {}, complete, cancel);
};


/**
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.visitorList = function(complete, cancel) {
  this.__makeRequest('visitor_list', {}, complete, cancel);
};


/**
 * @param {string} data Network data.
 */
qa.business.members.__handleData = function(data) {
  var dataObject = util.decodeJsonData(data);
  if (dataObject instanceof Object) {
    var callbacks = this.__callbacks[dataObject['response']];
    if (callbacks !== undefined && callbacks.length > 0) {
      for (var i = 0, l = callbacks.length; i < l; i += 1) {
        callbacks[i](dataObject);
      }
    }
  }
};


/**
 * @param {string} type Action`s type.
 * @param {Object} body Request data.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.__makeRequest = function(type, body,
                                             complete, cancel) {
  var template = {
    'request': type,
    'body': body
  };

  var self = this;
  var callback = function(data) {
    var code = 0;
    if (typeof data['errno'] === 'number') {
      code = data['errno'];
    }

    self.__callbacks[type].remove(callback);
    if (code === 0) {
      complete(data);
    } else {
      cancel(data['errtext'], code);
    }
  };

  if (this.__callbacks[type] === undefined) {
    this.__callbacks[type] = new ds.queue.Queue;
  }

  this.__callbacks[type].push(callback);
  this.__connection.write(util.encodeJsonData(template));
};
