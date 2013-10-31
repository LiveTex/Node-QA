


/**
 * @interface
 */
qa.business.io.IProtocol = function() {};


/**
 * @param {string} type Message type.
 * @param {!Object} data Message data.
 * @return {string} Encoded data ready to send.
 */
qa.business.io.IProtocol.prototype.encode = function(type, data) {};


/**
 * @param {string} data Encoded received from connection data.
 * @return {Object} Decoded message.
 */
qa.business.io.IProtocol.prototype.decode = function(data) {};


/**
 * @param {string} data Encoded received from connection data.
 * @return {string} Decoded message type.
 */
qa.business.io.IProtocol.prototype.decodeType = function(data) {};
