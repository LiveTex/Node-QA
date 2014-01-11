

var qa = require('../bin/index.js');
var async = require('node-async');
var cli = require('node-cli');
var logger = new cli.Logger();
logger.setConsole(console);


console.info('Setting up test participants.');
//var chatSlave = qa.business.io.createChatServerSlave('192.168.48.113');
var chatSlave = qa.business.io.createChatServerSlave('192.168.48.246');
var memberSession = new qa.business.io.MemberSession(chatSlave);
var member = new qa.business.entity.Member('testetrem@gmail.com', '123123');
var chatFeature = new qa.business.entity.Feature('*', '444');
//var livetexIoHost = 'net://io2-unstablehttp.livetex.ru';
var livetexIoHost = 'net://io2-testhttp.livetex.ru';
var siteId = 'account:568:site:10000183';

var stickyVisitorSession = new qa.business.io.VisitorSession(
    livetexIoHost, chatSlave);
var stickyVisitor = new qa.business.entity.Visitor(siteId);
stickyVisitor.setFeature(chatFeature);

var anotherVisitorSession = new qa.business.io.VisitorSession(
    livetexIoHost, chatSlave);
var anotherVisitor = new qa.business.entity.Visitor(siteId);
anotherVisitor.setFeature(chatFeature);

console.info('Starting scenario.');

var stickyVisitorScenario = async.sequence([
  qa.business.utils.async.barrier('member ready'),
  qa.business.app.visitor.auth,
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.openChat,
  qa.business.app.visitor.assertHasChatWith(member),
  qa.business.utils.async.barrier('sticky visitor opened chat'),
  qa.business.app.visitor.chatDisconnect,
  qa.business.app.visitor.waitTillChatClose,
  qa.business.utils.async.barrier('sticky visitor closed chat', 3),
  qa.business.utils.async.barrier('sticky visitor can reopen chat'),
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.openChat,
  qa.business.app.visitor.assertRoboChat,
  async.parallel([
    qa.business.app.visitor.waitForChat,
    qa.business.utils.async.barrier('sticky chat reopened')
  ]),
  qa.business.utils.async.barrier('sticky get real chat'),
  qa.business.app.visitor.assertHasChatWith(member),
  qa.business.utils.async.barrier('All is OK', 3)
]);

var memberScenario = async.sequence([
  qa.business.app.member.auth,
  qa.business.app.member.chatList,
  qa.business.app.member.closeAllChats,
  qa.business.app.member.chatList,
  qa.business.app.member.assertHasNoChats,
  qa.business.utils.async.barrier('member ready'),
  qa.business.app.member.waitForChat,
  qa.business.utils.async.barrier('sticky visitor opened chat'),
  qa.business.app.member.assertHasChatWith(stickyVisitor),
  qa.business.utils.async.barrier('sticky visitor closed chat', 3),
  qa.business.app.member.waitForChat,
  qa.business.utils.async.barrier('another visitor opened chat'),
  qa.business.app.member.assertHasChatWith(anotherVisitor),
  qa.business.utils.async.barrier('sticky visitor can reopen chat'),
  qa.business.utils.async.barrier('sticky chat reopened'),
  qa.business.app.member.closeChat(anotherVisitor),
  qa.business.utils.async.barrier('sticky get real chat'),
  qa.business.app.member.visitorList,
  qa.business.app.member.assertIsVisitorOnline(stickyVisitor),
  qa.business.utils.async.barrier('All is OK', 3)
]);

var anotherVisitorScenario = async.sequence([
  qa.business.utils.async.barrier('sticky visitor closed chat', 3),
  qa.business.app.visitor.auth,
  qa.business.app.visitor.chatAuth,
  qa.business.app.visitor.openChat,
  qa.business.app.visitor.assertHasChatWith(member),
  qa.business.utils.async.barrier('another visitor opened chat'),
  qa.business.utils.async.barrier('All is OK', 3)
]);

stickyVisitorScenario.call(stickyVisitorSession, stickyVisitor,
    function(data) {process.exit(0);}, console.error);

anotherVisitorScenario.call(anotherVisitorSession, anotherVisitor,
    function(data) {process.exit(0);}, console.error);

memberScenario.call(memberSession, member, function(data) {
  process.exit(0);
}, console.error);
