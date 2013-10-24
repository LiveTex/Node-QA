


/**
 * @constructor
 * @param {string} type Request type.
 * @param {Object} body Request body.
 */
qa.business.ChatServerRequest = function(type, body) {
  qa.business.Message.call(this, type, util.encodeJsonData({
    'request': type,
    'body': body
  }));
};

util.inherits(qa.business.ChatServerRequest, qa.business.Message);
