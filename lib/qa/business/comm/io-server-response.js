


/**
* @constructor
* @extends {qa.business.comm.Message}
* @param {string} type Response type.
* @param {!Object} packetData Packet data.
* @param {!string} poll Polling channel.
*/
qa.business.comm.AuthIoServerResponse = function(type, packetData, poll) {
  qa.business.comm.Message.call(this, type, packetData);

  /**
   * @type {!string}
   */
  this.__session = typeof (packetData['session'] === 'string') ?
      packetData['session'] : '';

  /**
   * @type {!string}
   */
  this.__source = typeof (packetData['source'] === 'string') ?
      packetData['source'] : '';

  /**
   * @type {!Object}
   */
  this.__body = packetData['body'] instanceof Object ? packetData['body'] : {};

  /**
   * @type {!string}
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
 * @return {!string}
 */
qa.business.comm.AuthIoServerResponse.prototype.getPoll = function() {
  return this.__poll;
};


/**
 * @return {!string}
 */
qa.business.comm.AuthIoServerResponse.prototype.getSession = function() {
  return this.__session;
};


/**
 * @return {!string}
 */
qa.business.comm.AuthIoServerResponse.prototype.getSource = function() {
  return this.__source;
};


/**
 * @param {!string} packetData
 * @return {qa.business.comm.AuthIoServerResponse}
 */
qa.business.app.web.AuthIoServerResponse.decode = function(packetData) {
  var packetStart = packetData.search('{');
  var pollStart = packetData.search('poll_');
  var packetDataDecoded = util.decodeJsonData(response.slice(packetStart));
  var poll = response.slice(0, pollStart + 'poll_'.length);
  poll = poll.substr(0, poll.search('ftn'));
  return new qa.business.comm.AuthIoServerResponse(
      packetDataDecoded['response'], packetDataDecoded, poll);
};
