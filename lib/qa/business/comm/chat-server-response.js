


/**
 * @constructor
 * @extends {qa.business.comm.Message}
 * @param {string} type Response type.
 * @param {!Object} packetData Packet data.
 */
qa.business.comm.ChatServerResponse = function(type, packetData) {
  qa.business.comm.Message.call(this, type, packetData);

  /**
   * @type {!Object}
   */
  this.__body = packetData['body'] instanceof Object ? packetData['body'] : {};
};

util.inherits(qa.business.comm.ChatServerResponse, qa.business.comm.Message);


/**
 * @return {!Object} Response body.
 */
qa.business.comm.ChatServerResponse.prototype.getBody = function() {
  return this.__body;
};


/**
 * @inheritDoc
 */
qa.business.comm.ChatServerResponse.decode = function(packetData) {
  var packet = util.decodeJsonData(packetData);
  if (packet instanceof Object &&
      typeof packet['response'] === 'string' &&
      typeof packet['errno'] === 'number') {
    return new qa.business.comm.ChatServerResponse(packet['response'], packet);
  }

  return null;
};
