


/**
 * @constructor
 * @param {!ts.Slave} chatSlave Chat server slave.
 */
qa.business.io.MemberSession = function(chatSlave) {

  /**
   * @type {qa.business.io.ChatServerConnection}
   */
  this.__chatServerConnection = null;

  /**
   * @type {!ts.Slave}
   */
  this.__slave = chatSlave;
};


/**
 * @param {!qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.auth =
    function(holder, complete, cancel) {

  if (this.__chatServerConnection !== null) {
    console.warn('Creating a new member chat-server connection ' +
        'while old still exists.');
  }
  this.__chatServerConnection =
      new qa.business.io.ChatServerConnection(this.__slave);

  var member = holder.getMember();
  var authData = member.serializeAuthInfo();
  authData['source'] = 'operator';

  this.__chatServerConnection.request('auth', authData, function(data) {
    if (data['body'] instanceof Object) {
      if (typeof data['errno'] === 'number') {
        member.setAuthStatus(data['errno']);
      }
      complete(data['body']);
    } else {
      cancel('Wrong auth action response: ' + util.encodeJsonData(data));
    }
  }, cancel);
};


/**
 * @param {*} _ Data.
 * @param {function(!Array.<!Object>)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.chatList =
    function(_, complete, cancel) {
  this.__chatServerConnection.request(
      'chat_list', {}, function(data) {
        if (data['body'] instanceof Object &&
            data['body']['chat_list'] instanceof Array) {

          complete(data['body']['chat_list']);
        } else {
          cancel('Wrong chat_list action response ' +
              '[qa.business.io.MemberSession#chatList]: ' +
              util.encodeJsonData(data));
        }
      }, cancel);
};


/**
 * @param {string} siteId Site identifier.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.visitorList =
    function(siteId, complete, cancel) {
  this.__chatServerConnection.request('visitor_list', {'site_id': siteId},
      function(data) {
        if (data['body'] instanceof Object &&
            data['body']['visitor_list'] instanceof Array) {

          complete(data['body']['visitor_list']);
        } else {
          cancel('Wrong visitor_list action response ' +
              '[qa.business.io.MemberSession#visitorList]: ' +
              util.encodeJsonData(data));
        }
      }, cancel);
};


/**
 * @param {string|!Array.<string>} chatId Chat identifier.
 * @param {function(!Array.<string>)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.closeChat =
    function(chatId, complete, cancel) {
  var chatIds = typeof chatId === 'string' ? [chatId] : chatId;
  this.__chatServerConnection.request('chat_close2', {
    'chat_id_list': chatIds,
    'flag_autoclose': false,
    'flag_ignore': false,
    'flag_spam': false,
    'ignore_text': '',
    'vote_id': 1
  }, function(data) {
    if (data['body'] instanceof Object &&
        data['body']['chat_id_list'] instanceof Array) {

      complete(data['body']['chat_id_list']);
    } else {
      cancel('Wrong chat_close2 response ' +
          '[qa.business.io.MemberSession#closeChat]: ' +
          util.encodeJsonData(data));
    }
  }, cancel);
};


/**
 * Closes chat server connection.
 */
qa.business.io.MemberSession.prototype.disconnect = function() {
  this.__chatServerConnection.destroy();
};


/**
 * @param {!qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.waitForChat =
    function(holder, complete, cancel) {
  this.__chatServerConnection.setCallback('chat', function(data) {
    if (data['body'] instanceof Object) {
      complete(data['body']);
    } else {
      cancel('Received wrong chat notification ' +
          '[qa.business.io.MemberSession#waitForChat]: ' +
          util.encodeJsonData(data));
    }
  });
};
