


/**
 * @implements {qa.business.io.IProtocol}
 * @constructor
 */
qa.business.io.LivetexServerProtocol = function() {};


/**
 * @type {string}
 */
qa.business.io.LivetexServerProtocol.UNKNOWN_ACTION_TYPE = 'unknown';


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerProtocol.prototype.encode = function(type, data) {
  switch (type) {
    case 'auth': {
      return '/handshake/' + Date.now().toString() + '?' +
          util.encodeFormData({
            'hold_timeout': 0,
            'destroy_timeout': 40000,
            'hold_for_auth': true,
            'first_data': util.encodeJsonData(data)
          });
    }

    default: {
      return '';
    }
  }
};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerProtocol.prototype.decode = function(payload) {
  var jsonData = payload.slice(payload.indexOf('{'));
  var data = util.decodeJsonData(jsonData);
  if (data instanceof Object) {
    return data;
  }

  return null;
};


/**
 * @inheritDoc
 */
qa.business.io.LivetexServerProtocol.prototype.decodeType = function(payload) {
  var jsonData = payload.slice(payload.indexOf('{'));
  var data = util.decodeJsonData(jsonData);
  if (data instanceof Object &&
      typeof data['response'] === 'string') {
    return data['response'];
  }

  return qa.business.io.LivetexServerProtocol.UNKNOWN_ACTION_TYPE;
};


/**
 * @param {string} data Data.
 * @return {string} Poll identifier.
 */
qa.business.io.LivetexServerProtocol.prototype.getPollId = function(data) {
  var pollId = '';
  var ftn = data.split('ftn');
  if (ftn.length > 1) {
    var polls = ftn[1].split('poll_');
    if (polls.length > 1) {
      return 'poll_' + polls[1];
    }
  }

  return pollId;
};
