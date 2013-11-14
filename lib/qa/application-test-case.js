


/**
 * @constructor
 * @extends {qa.TestCase}
 * @param {string=} opt_name Test-Case name.
 */
qa.ApplicationTestCase = function(opt_name) {
  qa.TestCase.call(this, opt_name);

  /**
   * @type {Array.<!qa.business.entity.Client>}
   */
  this.__clients = [];

};

util.inherits(qa.ApplicationTestCase, qa.TestCase);


/**
 * @param {!qa.business.entity.Client} client
 */
qa.ApplicationTestCase.prototype.addClient = function(client) {
  this.__clients.push(client);
};


/**
 * @return {!async.TaskFunction} Дейсвие выполнения сценария.
 */
qa.ApplicationTestCase.prototype.buildStep = function() {
  var self = this;
  var parallelTasks = [];

  var getClientByIndex = function(index) {
    return function(data, complete) {
      complete(data.__clients[index].getUser());
    }
  };

  for (var i = 0; i < this.__clients.length; i++) {
    parallelTasks.push(async.sequence([
      getClientByIndex(i),
      this.__clients[i].getScenario()
    ]).bind(this.__clients[i].getSession()));
  }

  return function(data, complete, cancel) {
    async.sequence(
        [self.__setUp].concat(async.parallel(parallelTasks)).
        concat(self.__steps).concat(self.__tearDown)).
        call(null, data, complete, cancel);
  }
};
