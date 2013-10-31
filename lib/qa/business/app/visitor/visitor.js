

/**
 * + 1000 for network lags
 * @type {number}
 */
qa.business.app.visitor.VISITOR_SESSION_TIMEOUT = 10000 + 1000;


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
    // nothing to populate right now
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
 * @this {qa.business.io.VisitorSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Chat holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.chatDisconnect = function(holder, complete, cancel) {
  this.chatDisconnect();
  holder.getVisitor().setHasOnlineChat(false);
  complete(holder);
};


/**
 * @this {qa.business.io.VisitorSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Chat holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.waitForChat = function(holder, complete, cancel) {
  this.waitForChat(holder, function(chat) {
    qa.business.app.visitor.__handleChatOpen(holder, chat);
    complete(holder);
  }, cancel);
};


/**
 * @param {*} data Data.
 * @param {function(*)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.waitTillChatClose = function(data, complete, cancel) {
  qa.business.utils.async.delayActor(
      qa.business.app.visitor.VISITOR_SESSION_TIMEOUT)(data, complete, cancel);
};


/**
 * @this {qa.business.io.VisitorSession}
 * @param {*} data Data.
 * @param {function(*)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.ioDisconnect = function(data, complete, cancel) {
  this.livetexDisconnect();
  complete(data);
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Chat holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.assertChatOpened =
    function(holder, complete, cancel) {
  if (holder.getVisitor().hasOnlineChat()) {
    complete(holder);
  } else {
    cancel('Visitor has no online chat. ' +
        '[qa.business.app.visitor.assertChatOpened]');
  }
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Chat holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.visitor.assertRoboChat = function(holder, complete, cancel) {
  if (holder.getVisitor().getChatMemberId() === '0') {
    complete(holder);
  } else {
    cancel('Chat member id: ' + holder.getVisitor().getChatMemberId() +
        ' instead of 0. [qa.business.app.visitor.assertRoboChat]');
  }
};


/**
 * @param {!qa.business.entity.IMemberHolder} holder Member holder.
 * @return {function(!qa.business.entity.IVisitorHolder, function(!qa.business.entity.IVisitorHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.visitor.assertChatMember = function(holder) {
  var member = holder.getMember();
  return function(holder, complete, cancel) {
    if (holder.getVisitor().getChatMemberId() === member.getId()) {
      complete(holder);
    } else {
      cancel('Visitor`s chat member: ' + holder.getVisitor().getChatMemberId() +
          ' instead of ' + member.getId() +
          '. [qa.business.app.visitor.assertChatMember]');
    }
  }
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor.
 * @param {!Object} data Chat_open (or reopen) data.
 */
qa.business.app.visitor.__handleChatOpen = function(holder, data) {
  var visitor = holder.getVisitor();
  if (data['errno'] === 0 &&
      data['body'] instanceof Object) {
    visitor.populateChatResponse(data['body']);
  } else {
    visitor.removeActiveChat();
  }
};
