


/**
 * @interface
 */
qa.business.comm.Protocol = function() {};


/**
 * @param {!qa.business.comm.Message} message Message.
 * @return {string} Encoded data ready to send.
 */
qa.business.comm.Protocol.prototype.encode = function(message) {};


/**
 * @param {string} data Encoded received from connection data.
 * @return {qa.business.comm.Message} Decoded message.
 */
qa.business.comm.Protocol.prototype.decode = function(data) {};
