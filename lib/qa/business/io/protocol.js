


/**
 * @interface
 */
qa.business.io.Protocol = function() {};


/**
 * @param {!qa.business.io.Message} message Message.
 * @return {string} Encoded data ready to send.
 */
qa.business.io.Protocol.prototype.encode = function(message) {};


/**
 * @param {string} data Encoded received from connection data.
 * @return {qa.business.io.Message} Decoded message.
 */
qa.business.io.Protocol.prototype.decode = function(data) {};
