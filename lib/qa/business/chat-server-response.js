


/**
 * @constructor
 * @extends {qa.business.Message}
 * @param {string} type Response type.
 * @param {!Object} packetData Packet data.
 */
qa.business.ChatServerResponse = function(type, packetData) {
  qa.business.Message.call(this, type, packetData);

  /**
   * @type {!Object}
   */
  this.__body = packetData['body'] instanceof Object ? packetData['body'] : {};
};

util.inherits(qa.business.ChatServerResponse, qa.business.Message);


/**
 * @return {!Object} Response body.
 */
qa.business.ChatServerResponse.prototype.getBody = function() {
  return this.__body;
};


/**
 * @inheritDoc
 */
qa.business.ChatServerResponse.decode = function(packetData) {
  var packet = util.decodeJsonData(packetData);
  if (packet !== null &&
      typeof packet['response'] === 'string' &&
      packet['body'] instanceof Object &&
      typeof packet['errno'] === 'number') {
    return new qa.business.ChatServerResponse(packet['response'], packet);
  }

  return null;
};
