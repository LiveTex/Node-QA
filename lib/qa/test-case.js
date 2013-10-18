

/**
 * @param {string=} opt_name Имя тест-кейса.
 * @constructor
 */
qa.TestCase = function(opt_name) {

  /**
   * @type {string=} Имя тест-кейса.
   * @private
   */
  this.__name = opt_name;

  /**
   * @type {!Array.<!async.TaskFunction>}
   */
  this.__steps = [];

  /**
   * @type {!async.TaskFunction}
   */
  this.__setUp = async.nop;

  /**
   * @type {!async.TaskFunction}
   */
  this.__tearDown = async.nop;


  this.setUp(async.nop);
  this.tearDown(async.nop);

};


/**
 * @return {string=} Имя теста.
 */
qa.TestCase.prototype.getName = function() {
  return this.__name;
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.setUp = function(step) {
  var self = this;

  this.__setUp = function(data, complete, cancel) {
    qa.report.__reporter.caseStarted(self.getName());
    step.call(null, self, complete, cancel);
  };
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.addStep = function(step) {
  var self = this;

  this.__steps.push(function(data, complete, cancel) {
    step.call(null, self, complete, cancel);
  });
};


/**
 * @param {!qa.TestCase} testCase Задача шага.
 */
qa.TestCase.prototype.addCase = function(testCase) {
  this.__steps.push(testCase.buildStep());
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.tearDown = function(step) {
  var self = this;

  this.__tearDown = function(data, complete, cancel) {
    function loaclComplete(data) {
      qa.report.__reporter.caseStopped(self.getName());
      complete(data);
    }

    step.call(null, self, loaclComplete, cancel);
  }
};


/**
 * @return {!async.TaskFunction} Дейсвие выполнения сценария.
 */
qa.TestCase.prototype.buildStep = function() {
  return async.sequence(
    [this.__setUp].concat(this.__steps).concat(this.__tearDown));
};
