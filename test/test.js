qa = require('../bin');

var scenario = function(suite) {
  function setUp(data, complete) {
    console.info("SetUp TaskFunction was called.");
    qa.assert.ok(true);
    data["test"] = "OK";
    complete(data);
  }
  suite.setUp(setUp);

  function tearDown(data, complete) {
    console.info("TearDown TaskFunction was called.");
    qa.assert.ok(true);
    console.log(data["test"]);
    complete(data);
  }
  suite.tearDown(tearDown);

  function testCaseStep(data, complete) {
    console.info("testCase step TaskFunction was called.");
    qa.assert.ok(true);
    console.log(data["test"]);
    complete(data);
  }
  var testCase = new qa.TestCase("Nested test case.");
  testCase.addStep(testCaseStep);
  suite.addCase(testCase);

  function suiteStep(data, complete) {
    console.info("suiteStep TaskFunction was called.");
    console.log(data["test"]);
    qa.assert.ok(true);
    complete(data);
  }
  suite.addStep(suiteStep);
};

qa.run(scenario);
