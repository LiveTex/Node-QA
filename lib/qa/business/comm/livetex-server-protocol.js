


/**
 * @implements {qa.business.comm.Protocol}
 * @constructor
 */
qa.business.comm.LivetexServerProtocol = function() {};


/**
 * @inheritDoc
 */
qa.business.comm.LivetexServerProtocol.prototype.encode = function(message) {
  switch (message.getType()) {
    case 'auth': {
      return '/handshake/' + Date.now().toString() + '?' +
          util.encodeFormData({
            'hold_timeout': 0,
            'destroy_timeout': 40000,
            'hold_for_auth': true,
            'first_data': util.encodeJsonData(message.getData())
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
qa.business.comm.LivetexServerProtocol.prototype.decode = function(payload) {
  var jsonData = payload.slice(payload.indexOf('{'));
  var data = util.decodeJsonData(jsonData);
  if (data instanceof Object &&
      typeof data['response'] === 'string') {
    return new qa.business.comm.Message(data['response'], data);
  }

  return null;
};


/**
 * @param {string} data Data.
 * @return {string} Poll identifier.
 */
qa.business.comm.LivetexServerProtocol.prototype.getPollId = function(data) {
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
