var qa = require('../bin/index.js');
var exec = require('node-exec');
var async = require('node-async');
//var config = require('config');
config = {
  site: '1231231',
  login: 'user@example.com',
  password: '123123'
}

//var visitor = qa.business.app.visitor;
//var member = qa.business.app.member;

var scenario = function(suite) {

  function log(data, complete, cancel) {
    console.log(data);
    complete(data);
  }

  function logComment(comment) {
    return function(data, complete, cancel) {
      console.log(comment);
      complete(data);
    }
  }

  function openSite(list) {
    return async.sequence([logComment('open-site')].concat(list));
  }

  function openChat(list) {
    return async.sequence([logComment('open-chat')].concat(list));
  }

  function reopenChat(list) {
    return async.sequence([logComment('reopen-chat')].concat(list));
  }

  function login(list) {
    return async.sequence([logComment('login')].concat(list));
  }

  function barrier(barrierId, opt_weight) {
    return function(data, complete, cancel) {
      function localComplete(localData) {
        console.log(barrierId);
        complete(data);
      }
      exec.barrier.hold(barrierId, localComplete, cancel, opt_weight);
    }
  }

  var appTestCase = new qa.ApplicationTestCase();


  var firstVisitor = new qa.business.entity.Client(
      new qa.business.entity.Visitor(config.site),
      async.sequence([
        log,
        openSite([
          barrier('1st-visitor-auth'),
          logComment('visitor.selectAvailableMember'),
          openChat([
            barrier('1st-visitor-open-chat'),
            logComment('visitor.assert.ChatOpened')
          ])
        ]),
        barrier('1st-visitor-close-site'),
        barrier('2nd-visitor-opened-chat'),
        openSite([
          barrier('1st-visitor-auth-again'),
          logComment('visitor.selectAvailableMember'),
          reopenChat([
            barrier('1st-visitor-reopen-chat'),
            logComment('visitor.assert.ChatOpened')
          ])
        ])
      ]),
      {}//new qa.business.entity.VisitorSession()
      );
  appTestCase.addClient(firstVisitor);


  var secondVisitor = new qa.business.entity.Client(
      new qa.business.entity.Visitor(config.site),
      async.sequence([
        log,
        barrier('1st-visitor-close-site'),
        openSite([
          barrier('2nd-visitor-auth'),
          logComment('visitor.selectAvailableMember'),
          openChat([
            barrier('2nd-visitor-open-chat'),
            logComment('visitor.assert.ChatOpened'),
            barrier('2nd-visitor-opened-chat')
          ])
        ])
      ]),
      {}//new qa.business.entity.VisitorSession()
      );
  appTestCase.addClient(secondVisitor);


  var member = new qa.business.entity.Client(
      new qa.business.entity.Member(config.login, config.password),
      async.sequence([
        login([
          log,
          logComment('member.assert.maxChats(1)'),
          barrier('1st-visitor-auth'),
          logComment('member.assert.visitorListLength(1)'),
          barrier('1st-visitor-open-chat'),
          logComment('member.assert.ChatOpened'),
          barrier('2nd-visitor-auth'),
          logComment('member.assert.visitorListLength(1)'),
          barrier('2nd-visitor-open-chat'),
          logComment('member.assert.ChatOpened'),
          barrier('1st-visitor-auth-again'),
          logComment('member.assert.visitorListLength(2)'),
          barrier('1st-visitor-reopen-chat'),
          logComment('member.assert.ChatNotOpened')
        ])
      ]),
      {}//new qa.business.entity.MemeberSession()
      );
  appTestCase.addClient(member);


  suite.addCase(appTestCase);
};

qa.run(scenario);
