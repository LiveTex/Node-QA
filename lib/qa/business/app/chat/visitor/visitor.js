

/**
 * @this {qa.business.app.Application}
 * @param {qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.app.chat.visitor.auth = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  this.getConnectionByName(visitor.getChatServerChannel()).request(
      new qa.business.comm.ChatServerRequest('auth', {
        'session': visitor.getSession(),
        'site_id': visitor.getShortSiteId()}
      ), complete, cancel);
};


/**
 * @this {qa.business.app.Application}
 * @param {qa.business.entity.IChatHolder} holder Chat holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.app.chat.visitor.openChat = function(holder, complete, cancel) {
  this.getConnectionByName(holder.getVisitor().getChatServerChannel()).request(
      new qa.business.comm.ChatServerRequest('chat_open', {
        'visitor_name': 'Script visitor',
        'chat_attr_value_id': 0,
        'attributes': {},
        'visitor_attributes': {},
        'open_page': '',
        'group_id': holder.getGroup().getId()
      }), complete, cancel, 'chat');
};


/**
 * @this {qa.business.app.Application}
 * @param {qa.business.entity.IChatHolder} holder Chat holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.app.chat.visitor.reopenChat = function(holder, complete, cancel) {
  this.getConnectionByName(holder.getVisitor().getChatServerChannel()).request(
      new qa.business.comm.ChatServerRequest('chat_reopen', {
        'visitor_name': 'Script visitor'
      }), complete, cancel, 'chat');
};
