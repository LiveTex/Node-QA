

var qa = require('../bin/index.js');
var async = require('node-async');
var cli = require('node-cli');
var logger = new cli.Logger();
logger.setConsole(console);


console.info('Setting up test participants.');
//var chatSlave = qa.business.io.createChatServerSlave('192.168.48.113');
var chatSlave = qa.business.io.createChatServerSlave('evgen.livetex.ru');
var memberSession = new qa.business.io.MemberSession(chatSlave);

/* should be different members:
 * - with chat count restriction = 1
 * - in invisible group only
 * - only with default group
 */
var member = new qa.business.entity.Member('testetrem@gmail.com', '123123');

var chatFeature = new qa.business.entity.Feature('*', '444');
//var livetexIoHost = 'net://io2-unstablehttp.livetex.ru';
var livetexIoHost = 'net://io2-evgen.livetex.ru';
var siteId = 'account:568:site:10000183';

var visitorSession = new qa.business.io.VisitorSession(
    livetexIoHost, chatSlave);
var visitor = new qa.business.entity.Visitor(siteId);
visitor.setFeature(chatFeature);

console.info('Starting scenario.');

var visitorScenario = async.sequence([
  qa.business.utils.async.barrier('member ready'),
  qa.business.app.visitor.auth,
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.openChat,
  qa.business.app.visitor.assertHasChatWith(member),
  qa.business.utils.async.barrier('both have opened chat'),
  qa.business.utils.async.barrier('member has the visitor chat'),
  qa.business.app.visitor.chatDisconnect,
  qa.business.app.visitor.waitTillChatClose,
  qa.business.utils.async.barrier('visitor can reopen chat'),
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.reopenChat,
  qa.business.app.visitor.assertHasChatWith(member)
]);

var memberScenario = async.sequence([
  qa.business.app.member.auth,
  qa.business.app.member.chatList,
  qa.business.app.member.closeAllChats,
  qa.business.app.member.chatList,
  qa.business.app.member.assertHasNoChats,
  qa.business.utils.async.barrier('member ready'),
  qa.business.app.member.waitForChat,
  qa.business.utils.async.barrier('both have opened chat'),
  qa.business.app.member.assertHasChatWith(visitor),
  qa.business.utils.async.barrier('member has the visitor chat'),
  qa.business.app.member.waitForChat,
  qa.business.app.member.assertHasNoOnlineChatWith(visitor),
  async.parallel([
    qa.business.utils.async.barrier('visitor can reopen chat'),
    qa.business.app.member.waitForChat
  ]),
  qa.business.app.member.assertHasChatWith(visitor)
]);

visitorScenario.call(visitorSession, visitor, function(data) {}, console.error);

memberScenario.call(memberSession, member, function(data) {
  console.log('All is OK.');
  process.exit(0);
}, console.error);
