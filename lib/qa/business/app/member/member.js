

/**
 * @this {qa.business.io.MemberSession}
 * @param {!qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(!qa.business.entity.IMemberHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.auth = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.auth(member, function(data) {
    member.populateAuthInfo(data);
    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {!qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(!qa.business.entity.IMemberHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.chatList = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.chatList(holder, function(chatList) {
    var chatVisitors = {};
    for (var i = 0, l = chatList.length; i < l; i += 1) {
      var chat = chatList[i];
      if (typeof chat['visitor_id'] === 'string') {
        var visitor =
            qa.business.entity.factory.createVisitorFromId(chat['visitor_id']);
        if (visitor !== null) {
          visitor.populateChatInfo(chat);
          if (visitor.getChatId()) {
            chatVisitors[visitor.getChatId()] = visitor;
          }
        }
      }
    }

    member.setChatVisitors(chatVisitors);
    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {qa.business.entity.IMemberHolder} holder Member holder.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.visitorList = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.visitorList('1', function(visitorList) {
    var visitors = {};
    for (var i = 0, l = visitorList.length; i < l; i += 1) {
      var chat = visitorList[i];
      if (typeof chat['visitor_id'] === 'string') {
        var visitor =
            qa.business.entity.factory.createVisitorFromId(chat['visitor_id']);
        if (visitor !== null) {
          visitor.populateVisitorInfo(chat);
          if (visitor.getId()) {
            visitors[visitor.getId()] = visitor;
          }
        }
      }
    }

    member.setVisitors(visitors);
    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @return {function(!qa.business.entity.IMemberHolder, function(!qa.business.entity.IMemberHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.member.closeChat = function(holder) {
  var visitor = holder.getVisitor();
  return function(holder, complete, cancel) {
    var member = holder.getMember();
    var chatId = visitor.getChatId();
    this.closeChat(chatId, function(closedChats) {
      if (closedChats.indexOf(chatId) !== -1) {
        delete member.getChatVisitors()[chatId];
        visitor.setHasOnlineChat(false);
      }
      complete(holder);
    }, cancel);
  }
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {!qa.business.entity.IMemberHolder} holder Visitor with a chat.
 * @param {function(!qa.business.entity.IMemberHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.closeAllChats = function(holder, complete, cancel) {
  var member = holder.getMember();
  var chatVisitors = member.getChatVisitors();
  var chats = Object.keys(chatVisitors) || [];

  this.closeChat(chats, function(closedChats) {
    for (var i = 0, l = closedChats.length; i < l; i += 1) {
      delete chatVisitors[closedChats[i]];
    }

    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {!qa.business.entity.IMemberHolder} holder Visitor with a chat.
 * @param {function(!qa.business.entity.IMemberHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.waitForChat = function(holder, complete, cancel) {
  var member = holder.getMember();
  this.waitForChat(holder, function(data) {
    if (data['chat'] instanceof Object) {
      var chat = data['chat'];
      if (typeof chat['chat_id'] === 'string' &&
          typeof chat['visitor_id'] === 'string') {
        var chatVisitors = member.getChatVisitors();
        var visitor = chatVisitors[chat['chat_id']];
        if (visitor === undefined) {
          visitor = qa.business.entity.factory.createVisitorFromId(
              chat['visitor_id']);
        }

        if (visitor !== null) {
          visitor.populateChatInfo(chat);
          if (visitor.getId()) {
            chatVisitors[visitor.getChatId()] = visitor;
          }
        }
      }
    }

    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {boolean} isBusy Is busy?
 * @return {function(!qa.business.entity.IMemberHolder, function(!qa.business.entity.IMemberHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.member.setBusy = function(isBusy) {
  return function(holder, complete, cancel) {
    this.setBusy(isBusy, function() {
      holder.getMember().setBusy(isBusy);
      complete(holder);
    }, cancel);
  };
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @return {function(!qa.business.entity.IMemberHolder, function(!qa.business.entity.IMemberHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.member.assertHasChatWith = function(holder) {
  var visitor = holder.getVisitor();
  return function(holder, complete, cancel) {
    var member = holder.getMember();
    if (member.getChatVisitors()[visitor.getChatId()] !== undefined) {
      complete(holder);
    } else {
      cancel('Member has no chat with given visitor. ' +
          '[qa.business.app.member.assertHasChatWith]');
    }
  };
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @return {function(!qa.business.entity.IMemberHolder, function(!qa.business.entity.IMemberHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.member.assertHasNoOnlineChatWith = function(holder) {
  var visitor = holder.getVisitor();
  return function(holder, complete, cancel) {
    var member = holder.getMember();
    if (member.getChatVisitors()[visitor.getChatId()] === undefined ||
        !member.getChatVisitors()[visitor.getChatId()].hasOnlineChat()) {
      complete(holder);
    } else {
      cancel('Member has a chat with given visitor. ' +
          '[qa.business.app.member.assertHasNoChatWith]');
    }
  };
};


/**
 * @param {!qa.business.entity.IMemberHolder} holder Visitor with a chat.
 * @param {function(!qa.business.entity.IMemberHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.assertHasNoChats = function(holder, complete, cancel) {
  if (Object.keys(holder.getMember().getChatVisitors()).length === 0) {
    complete(holder);
  } else {
    cancel('Member has chats. [qa.business.app.member.assertHasNoChats]');
  }
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @return {function(!qa.business.entity.IMemberHolder, function(!qa.business.entity.IMemberHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.member.assertIsVisitorOnline = function(holder) {
  var visitor = holder.getVisitor();
  return function(holder, complete, cancel) {
    var member = holder.getMember();
    var foundVisitor = member.getVisitors()[visitor.getId()];

    //console.log(member.getVisitors(), member.getChatVisitors(), visitor);
    if (foundVisitor !== undefined) {
      if (foundVisitor.hasOnlineChat() &&
          foundVisitor.getChatMemberId() === member.getId()) {
        complete(holder);
      } else {
        cancel('Visitor ' + visitor.getId() +
            ' has no active chat (in visitor-list) with member ' +
            member.getId() +
            '. [qa.business.app.member.assertHasOnlineChatWith]');
      }
    } else {
      cancel('Member has no chats (in visitor-list) with visitor: ' +
          visitor.getId() +
          '. [qa.business.app.member.assertHasOnlineChatWith]');
    }
  }
};


/**
 * @param {number} count Chat counts.
 * @return {function(!qa.business.entity.IMemberHolder, function(!qa.business.entity.IMemberHolder), function(string, number=))}
 *   Asserting task function.
 */
qa.business.app.member.assertHasChatsCount = function(count) {
  return function(holder, complete, cancel) {
    if (Object.keys(holder.getMember().getChatVisitors()).length === count) {
      complete(holder);
    } else {
      cancel('Member has ' + Object.keys(member.getChatVisitors()).length +
          ' chats instead of ' + count +
          '. [qa.business.app.member.assertHasChatsCount]');
    }
  };
};
