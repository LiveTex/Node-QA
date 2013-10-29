

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
    var chatVisitors = [];
    for (var i = 0, l = chatList.length; i < l; i += 1) {
      var chat = chatList[i];
      if (typeof chat['visitor_id'] === 'string') {
        var visitor =
            qa.business.entity.factory.createVisitorFromId(chat['visitor_id']);
        if (visitor !== null) {
          visitor.populateChatInfo(chat);
          chatVisitors.push(visitor);
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
    var visitors = [];
    for (var i = 0, l = visitorList.length; i < l; i += 1) {
      var chat = visitorList[i];
      if (typeof chat['visitor_id'] === 'string') {
        var visitor =
            qa.business.entity.factory.createVisitorFromId(chat['visitor_id']);
        if (visitor !== null) {
          visitor.populateVisitorInfo(chat);
          visitors.push(visitor);
        }
      }
    }

    member.setVisitors(visitors);
    complete(holder);
  }, cancel);
};


/**
 * @this {qa.business.io.MemberSession}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor with a chat.
 * @param {function(!Array.<string>)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.member.closeChat = function(holder, complete, cancel) {
  this.closeChat(holder.getVisitor().getChatId(), function(closedChats) {
    complete(closedChats);
  }, cancel);
};
