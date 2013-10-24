

var qa = require('../bin/index.js');


var scenario = function(suite) {
  var application = new qa.business.app.Application();
  var member = new qa.business.entity.Member('te.stetrem@gmail.com');


  function setUp(_, complete) {
    var connection = new qa.business.comm.ChatServerConnection('127.0.0.1');
    application.attachConnection(member.getName(), connection);
    console.info('SetUp TaskFunction was called.');
    complete(application);
  }

  suite.setUp(setUp);


  function tearDown(data, complete) {
    application.getConnectionByUser(member).destroy();
    console.info('TearDown TaskFunction was called.');
    complete(data);
  }

  suite.tearDown(tearDown);


  function suiteStep(data, complete) {
    console.info('suiteStep TaskFunction was called.');

    async.sequence([
      qa.business.app.member.auth,
      function(authResponse, complete, cancel) {
        console.log(authResponse.getData());
        complete(authResponse);
      }
    ]).call(application, data, complete, console.error);
  }

  suite.addStep(suiteStep);
};

qa.run(scenario);
