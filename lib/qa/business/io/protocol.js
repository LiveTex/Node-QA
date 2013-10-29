


/**
 * @interface
 */
qa.business.io.Protocol = function() {};


/**
 * @param {string} type Message type.
 * @param {!Object} data Message data.
 * @return {string} Encoded data ready to send.
 */
qa.business.io.Protocol.prototype.encode = function(type, data) {};


/**
 * @param {string} data Encoded received from connection data.
 * @return {Object} Decoded message.
 */
qa.business.io.Protocol.prototype.decode = function(data) {};


/**
 * @param {string} data Encoded received from connection data.
 * @return {string} Decoded message type.
 */
qa.business.io.Protocol.prototype.decodeType = function(data) {};
