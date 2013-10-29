

/**
 * @this {qa.business.io.VisitorSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.auth = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();

  this.auth(visitor, function(data) {
    visitor.populateWebAuth(data);
    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.VisitorSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.chatAuth = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  this.chatAuth(visitor, function(data) {
    // TODO: add populate, but right now we need nothing from chat auth data
    complete(visitor);
  }, cancel);
};


/**
 * @this {qa.business.io.VisitorSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Chat holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.openChat = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  this.openChat(holder, function(data) {
    qa.business.app.visitor.__handleChatOpen(holder, data);
    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.VisitorSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Chat holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.reopenChat = function(holder, complete, cancel) {
  this.reopenChat(holder, function(data) {
    qa.business.app.visitor.__handleChatOpen(holder, data);
    complete(holder);
  }, cancel);
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor.
 * @param {!Object} data Chat_open (or reopen) data.
 */
qa.business.app.visitor.__handleChatOpen = function(holder, data) {
  var visitor = holder.getVisitor();
  if (data['errno'] === 0 &&
      data['body'] instanceof Object) {
    visitor.populateChatInfo(data);
  } else {
    visitor.setChatId('');
  }
};
