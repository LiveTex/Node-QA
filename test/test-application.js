var qa = require('../bin/index.js');

var scenario = function(suite) {

  var appTestCase = new qa.ApplicationTestCase();


  var fstClient = new qa.business.entity.Client(
      new qa.business.entity.Visitor('account:1914:site:10001350'),
      function(data, complete, cancel) {
        console.log('first scenario.');
        console.log(data.getVisitor().getName());
        console.log(this.name);
        complete(data);
      },
      {name: 'context 1.'});
  appTestCase.addClient(fstClient);


  var sndClient = new qa.business.entity.Client(
      new qa.business.entity.Visitor('account:2914:site:10001350'),
      function(data, complete, cancel) {
        console.log('second scenario.');
        console.log(data.getVisitor().getName());
        console.log(this.name);
        complete(data);
      },
      {name: 'context 2.'});
  appTestCase.addClient(sndClient);


  var memberClient = new qa.business.entity.Client(
      new qa.business.entity.Member('user@example.com'),
      function(data, complete, cancel) {
        console.log('member scenario.');
        console.log(data.getMember().getName());
        console.log(this.name);
        complete(data);
      },
      {name: 'context 3.'});
  appTestCase.addClient(memberClient);


  suite.addCase(appTestCase);

};


qa.run(scenario);
