

var qa = require('../bin/index.js');
var async = require('node-async');


console.info('setUp is called');
var chatSlave = qa.business.io.createChatServerSlave('192.168.48.113');
var memberSession = new qa.business.io.MemberSession(chatSlave);
var member = new qa.business.entity.Member('te.stetrem@gmail.com', '1231231');

var visitorSession = new qa.business.io.VisitorSession(
    'http://io3-unstablehttp.livetex.ru', chatSlave);
var visitor = new qa.business.entity.Visitor('account:1914:site:10001350');
async.sequence([
  qa.business.app.visitor.auth,
  qa.business.app.visitor.chatAuth
]).call(visitorSession, visitor, function(data) {
  console.log('data:', data);
}, console.error);
