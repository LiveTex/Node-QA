

var qa = require('../bin/index.js');
var async = require('node-async');


var scenario = function(suite) {
  var application = new qa.business.app.Application();
  var member = new qa.business.entity.Member('te.stetrem@gmail.com');


  function setUp(_, complete) {
    member.setPassword('1231231');
    var connection = new qa.business.comm.ChatServerConnection('127.0.0.1');
    connection.connect();
    application.attachConnection(member.getName(), connection);
    console.info('setUp was called.');
    complete(application);
  }

  suite.setUp(setUp);


  function tearDown(data, complete) {
    application.getConnectionByUser(member).destroy();
    console.info('TearDown was called.');
    complete(data);
  }

  suite.tearDown(tearDown);


  function suiteStep(data, complete) {
    console.info('suiteStep was called.');

    async.sequence([
      qa.business.app.chat.member.auth,
      function(authResponse, complete, cancel) {
        console.log(authResponse.encode());
        complete(authResponse);
      }
    ]).call(application, member, complete, console.error);
  }

  suite.addStep(suiteStep);
};

qa.run(scenario);
