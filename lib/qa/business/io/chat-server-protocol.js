


/**
 * @implements {qa.business.io.Protocol}
 * @constructor
 */
qa.business.io.ChatServerProtocol = function() {};


/**
 * @inheritDoc
 */
qa.business.io.ChatServerProtocol.prototype.encode = function(message) {
  var template = {'request': message.getType(), body: {}};
  var data = message.getData();
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
      typeof data['response'] === 'string' &&
      typeof data['errno'] === 'number' &&
      typeof data['errtext'] === 'string') {
    return new qa.business.io.Message(data['response'], data);
  }

  return null;
};
