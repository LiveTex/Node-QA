


/**
* @constructor
* @extends {qa.business.comm.Message}
* @param {string} type Response type.
* @param {!Object} packetData Packet data.
* @param {string} poll Polling connection.
*/
qa.business.comm.AuthIoServerResponse = function(type, packetData, poll) {
  qa.business.comm.Message.call(this, type, packetData);

  /**
   * @type {string}
   */
  this.__session = typeof (packetData['session'] === 'string') ?
      packetData['session'] : '';

  /**
   * @type {string}
   */
  this.__source = typeof (packetData['source'] === 'string') ?
      packetData['source'] : '';

  /**
   * @type {!Object}
   */
  this.__body = packetData['body'] instanceof Object ? packetData['body'] : {};

  /**
   * @type {string}
   */
  this.__poll = poll;

};


/**
 * @return {!Object} Response body.
 */
qa.business.comm.AuthIoServerResponse.prototype.getBody = function() {
  return this.__body;
};


/**
 * @return {string} Polling connection.
 */
qa.business.comm.AuthIoServerResponse.prototype.getPoll = function() {
  return this.__poll;
};


/**
 * @return {string} Session identifier.
 */
qa.business.comm.AuthIoServerResponse.prototype.getSession = function() {
  return this.__session;
};


/**
 * @return {string} Auth source.
 */
qa.business.comm.AuthIoServerResponse.prototype.getSource = function() {
  return this.__source;
};


/**
 * @param {string} packetData Packet plain data.
 * @return {qa.business.comm.AuthIoServerResponse} Decoded response.
 */
qa.business.comm.AuthIoServerResponse.decode = function(packetData) {
  var packetStart = packetData.search('{');
  var pollStart = packetData.search('poll_');
  var packetDataDecoded = util.decodeJsonData(packetData.slice(packetStart));
  if (packetDataDecoded instanceof Object) {
    var poll = packetData.slice(pollStart);
    poll = poll.substr(0, poll.search('ftn'));
    return new qa.business.comm.AuthIoServerResponse(
        packetDataDecoded['response'], packetDataDecoded, poll);
  } else {
    return null;
  }
};
