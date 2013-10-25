

var qa = require('../bin/index.js');
var async = require('node-async');


console.info('setUp is called');
var app = new qa.business.app.Application();
var member = new qa.business.entity.Member('te.stetrem@gmail.com');
member.setPassword('1231231');

var slave = qa.business.comm.getChatServerSlave('127.0.0.1');
var connection = new qa.business.comm.ChatServerConnection(slave);

app.attachConnection(member.getName(), connection);

async.sequence([
  function(data, complete, cancel) {
    console.log('sequence is called');
    complete(data);
  },
  qa.business.app.chat.member.auth,
  function(authResponse, complete, cancel) {
    complete(authResponse);
  }
]).call(app, member, function() {
  app.getConnectionByUser(member).destroy();
  qa.business.comm.destroyChatServerSlave(slave);
  console.info('tearDown is called.');
  process.exit(0);
}, console.error);
