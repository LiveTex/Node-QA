


/**
 * @constructor
 * @extends {qa.business.Response}
 * @param {string} type Response type.
 * @param {!Object} packetData Packet data.
 */
qa.business.ChatServerResponse = function(type, packetData) {
  qa.business.Response.call(this, type, packetData['body']);

  this._isError = packetData['errno'] !== 0;
  this._errorText = packetData['errtext'];
};

util.inherits(qa.business.ChatServerResponse, qa.business.Response);


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
