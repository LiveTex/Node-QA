


/**
 * @constructor
 * @extends {qa.business.comm.Message}
 * @param {string} type Request type.
 * @param {Object} body Request body.
 */
qa.business.comm.ChatServerRequest = function(type, body) {
  qa.business.comm.Message.call(this, type, {
    'request': type,
    'body': body
  });
};

util.inherits(qa.business.comm.ChatServerRequest, qa.business.comm.Message);
