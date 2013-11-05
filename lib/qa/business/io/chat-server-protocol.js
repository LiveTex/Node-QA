


/**
 * @implements {qa.business.io.IProtocol}
 * @constructor
 */
qa.business.io.ChatServerProtocol = function() {};


/**
 * @type {string}
 */
qa.business.io.ChatServerProtocol.UNKNOWN_ACTION_TYPE = 'unknown';


/**
 * @inheritDoc
 */
qa.business.io.ChatServerProtocol.prototype.encode = function(type, data) {
  var template = {'request': type, body: {}};
  if (data instanceof Object) {
    template['body'] = data;
  }

  return util.encodeJsonData(template);
};


/**
 * @inheritDoc
 */
qa.business.io.ChatServerProtocol.prototype.decode = function(payload) {
  var data = util.decodeJsonData(payload);
  if (data instanceof Object &&
      typeof data['errno'] === 'number' &&
      typeof data['errtext'] === 'string') {
    return data;
  }

  return null;
};


/**
 * @inheritDoc
 */
qa.business.io.ChatServerProtocol.prototype.decodeType = function(payload) {
  var data = util.decodeJsonData(payload);
  if (data instanceof Object &&
      typeof data['response'] === 'string') {
    return data['response'];
  }

  return qa.business.io.ChatServerProtocol.UNKNOWN_ACTION_TYPE;
};