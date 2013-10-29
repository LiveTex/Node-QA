


/**
 * @constructor
 * @param {!ts.Slave} chatSlave Chat server slave.
 */
qa.business.io.MemberSession = function(chatSlave) {

  /**
   * @type {!qa.business.io.ChatServerConnection}
   */
  this.__chatServerConnection =
      new qa.business.io.ChatServerConnection(chatSlave);
};


/**
 * @param {!qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.auth =
    function(holder, complete, cancel) {
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
      'chat_list', {}, function(chatList) {
        if (chatList['body'] instanceof Object &&
            chatList['body']['chat_list'] instanceof Array) {

          complete(chatList['body']['chat_list']);
        } else {
          cancel('Wrong chat_list action response: ' +
              util.encodeJsonData(chatList));
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
      function(visitorList) {
        if (visitorList['body'] instanceof Object &&
            visitorList['body']['visitor_list'] instanceof Array) {

          complete(visitorList['body']['visitor_list']);
        } else {
          cancel('Wrong visitor_list action response: ' +
              util.encodeJsonData(visitorList));
        }
      }, cancel);
};


/**
 * @param {string} chatId Chat identifier.
 * @param {function(!Array.<string>)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.MemberSession.prototype.closeChat =
    function(chatId, complete, cancel) {
  this.__chatServerConnection.request('chat_close2', {
    'chat_id_list': [chatId],
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
      cancel('Wrong chat_close2 response.');
    }
  }, cancel);
};


/**
 * Closes chat server connection.
 */
qa.business.io.MemberSession.prototype.disconnect = function() {
  this.__chatServerConnection.destroy();
};
