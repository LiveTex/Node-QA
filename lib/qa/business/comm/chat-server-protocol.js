


/**
 * @implements {qa.business.comm.Protocol}
 * @constructor
 */
qa.business.comm.ChatServerProtocol = function() {
  qa.business.comm.Protocol.call(this);
};

util.inherits(qa.business.comm.ChatServerProtocol, qa.business.comm.Protocol);


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerProtocol.prototype.encode = function(message) {
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
qa.business.comm.ChatServerProtocol.prototype.decode = function(payload) {
  var data = util.decodeJsonData(payload);
  if (data instanceof Object &&
      typeof data['response'] === 'string' &&
      typeof data['errno'] === 'number' &&
      typeof data['errtext'] === 'string') {
    return new qa.business.comm.Message(data['response'], data);
  }

  return null;
};
