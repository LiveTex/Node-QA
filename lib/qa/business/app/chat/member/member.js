

/**
 * @this {qa.business.app.Application}
 * @param {qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.app.chat.member.auth = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.getConnectionByUser(member).request(
      new qa.business.comm.ChatServerRequest('auth', {
        'source': 'operator',
        'login': member.getLogin(),
        'password': member.getPassword()
      }), complete, cancel);
};


/**
 * @this {qa.business.app.Application}
 * @param {qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.app.chat.member.chatList = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.getConnectionByUser(member).request(
      new qa.business.comm.ChatServerRequest('chat_list', {}),
      complete, cancel);
};


/**
 * @this {qa.business.app.Application}
 * @param {qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.app.chat.member.visitorList = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.getConnectionByUser(member).request(
      new qa.business.comm.ChatServerRequest('chat_list', {
        'site_id': 1
      }), complete, cancel);
};
