

/**
 * @this {qa.business.Application}
 * @param {qa.business.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.auth = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.getConnectionByUser(member).request(
      new qa.business.ChatServerRequest('auth', {
        'source': 'operator',
        'login': member.getLogin(),
        'password': member.getPassword()
      }), complete, cancel);
};


/**
 * @this {qa.business.Application}
 * @param {qa.business.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.chatList = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.getConnectionByUser(member).request(
      new qa.business.ChatServerRequest('chat_list', {}), complete, cancel);
};


/**
 * @this {qa.business.Application}
 * @param {qa.business.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.members.visitorList = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.getConnectionByUser(member).request(
      new qa.business.ChatServerRequest('chat_list', {
        'site_id': 1
      }), complete, cancel);
};
