var qa = require('../bin/index.js');
var async = require('node-async');
var cli = require('node-cli');
var visitor = qa.business.app.visitor;
var member = qa.business.app.member;
var barrier = qa.business.utils.async.barrier;

var logger = new cli.Logger();
logger.setConsole(console);


console.info('Setting up test participants.');
var chatSlave = qa.business.io.createChatServerSlave('192.168.48.113');
var mobileMemberSession = new qa.business.io.MemberSession(chatSlave);
var mobileMember = new qa.business.entity.Member('testetrem@gmail.com',
    '123123', '77BD902C-9FBE-5EAB-944A-A5DC8421C846');
var chatFeature = new qa.business.entity.Feature('*', '444');
var livetexIoHost = 'net://io2-unstablehttp.livetex.ru';
var siteId = 'account:568:site:10000183';

var stickyVisitorSession = new qa.business.io.VisitorSession(
    livetexIoHost, chatSlave);
var stickyVisitor = new qa.business.entity.Visitor(siteId);
stickyVisitor.setFeature(chatFeature);

console.info('Starting scenario.');

var stickyVisitorScenario = async.sequence([
  barrier(mobileMember.getLogin() + ' ready'),
  visitor.auth,
  visitor.chatAuth,
  barrier('prepare for chat'),
  visitor.openChat,
  visitor.assertHasChatWith(mobileMember),
  barrier('visitor open chat'),
  visitor.ioDisconnect,
  barrier('ALL is OK!')
]);

var memberScenario = async.sequence([
  member.auth,
  member.chatList,
  member.closeAllChats,
  member.chatList,
  member.assertHasNoChats,
  barrier(mobileMember.getLogin() + ' ready'),
  barrier('prepare for chat'),
  member.waitForChat,
  barrier('visitor open chat'),
  member.assertHasChatWith(stickyVisitor),
  member.offline,
  barrier('ALL is OK!')
]);


stickyVisitorScenario.call(stickyVisitorSession, stickyVisitor,
    function(data) {process.exit(0);}, console.error);

memberScenario.call(mobileMemberSession, mobileMember,
    function(data) {process.exit(0);}, console.error);
