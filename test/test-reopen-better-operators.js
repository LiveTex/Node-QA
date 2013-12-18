

var qa = require('../bin/index.js');
var async = require('node-async');
var cli = require('node-cli');
var logger = new cli.Logger();
logger.setConsole(console);


console.info('Setting up test participants.');
//var chatSlave = qa.business.io.createChatServerSlave('192.168.48.113');
var chatSlave = qa.business.io.createChatServerSlave('evgen.livetex.ru');
var memberSession = new qa.business.io.MemberSession(chatSlave);
var memberBetterSession = new qa.business.io.MemberSession(chatSlave);

/* should be different members:
 * - with chat count restriction = 1
 * - in invisible group only
 * - only with default group
 */
var member = new qa.business.entity.Member('te.stetrem@gmail.com', '1231231');
var memberBetter = new qa.business.entity.Member('testetrem@gmail.com',
    '123123');

var chatFeature = new qa.business.entity.Feature('*', '377');
//var livetexIoHost = 'http://io2-unstablehttp.livetex.ru';
var livetexIoHost = 'http://io2-evgen.livetex.ru';
var siteId = 'account:568:site:10000103';

var visitorSession = new qa.business.io.VisitorSession(livetexIoHost,
    chatSlave);
var anotherVisitorSession = new qa.business.io.VisitorSession(livetexIoHost,
    chatSlave);

var visitor = new qa.business.entity.Visitor(siteId);
visitor.setFeature(chatFeature);
var anotherVisitor = new qa.business.entity.Visitor(siteId);
anotherVisitor.setFeature(chatFeature);

console.info('Starting scenario.');

var visitorScenario = async.sequence([
  qa.business.utils.async.barrier('member ready'),
  qa.business.app.visitor.auth,
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.openChat,
  qa.business.app.visitor.assertHasChatWith(member),
  qa.business.utils.async.barrier('both have opened chat'),
  qa.business.utils.async.barrier('member has the visitor chat', 3),
  qa.business.app.visitor.chatDisconnect,
  qa.business.utils.async.delayActor(1000),
  qa.business.utils.async.barrier('visitor can reopen chat'),
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.reopenChat,
  qa.business.app.visitor.assertHasChatWith(member)
]);

var memberScenario = async.sequence([
  qa.business.app.member.auth,
  qa.business.app.member.setBusy(false),
  qa.business.app.member.chatList,
  qa.business.app.member.closeAllChats,
  qa.business.app.member.chatList,
  qa.business.app.member.assertHasNoChats,
  qa.business.utils.async.barrier('member ready'),
  qa.business.app.member.waitForChat,
  qa.business.utils.async.barrier('both have opened chat'),
  qa.business.app.member.assertHasChatWith(visitor),
  qa.business.utils.async.barrier('member has the visitor chat', 3),
  qa.business.utils.async.barrier('another visitor open chat'),
  qa.business.app.member.chatList,
  qa.business.app.member.assertHasChatsCount(2),
  qa.business.utils.async.barrier('member has 2 chats'),
  qa.business.app.member.waitForChat,
  qa.business.app.member.assertHasChatWith(visitor)
]);

var memberBetterScenario = async.sequence([
  qa.business.utils.async.barrier('member has 2 chats'),
  qa.business.app.member.auth,
  qa.business.app.member.chatList,
  qa.business.app.member.closeAllChats,
  qa.business.app.member.chatList,
  qa.business.app.member.assertHasNoChats,
  qa.business.utils.async.barrier('visitor can reopen chat')
]);

var anotherVisitorScenario = async.sequence([
  qa.business.utils.async.barrier('member has the visitor chat', 3),
  qa.business.app.visitor.auth,
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.openChat,
  qa.business.app.visitor.assertHasChatWith(member),
  qa.business.utils.async.barrier('another visitor open chat')
]);

visitorScenario.call(visitorSession, visitor, function(data) {}, console.error);
anotherVisitorScenario.call(anotherVisitorSession, anotherVisitor,
    function(data) {}, console.error);

memberBetterScenario.call(memberBetterSession, memberBetter, function(data) {},
    console.error);
memberScenario.call(memberSession, member, function(data) {
  console.log('All is OK.');
  process.exit(0);
}, console.error);
