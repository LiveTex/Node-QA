


/**
 * @constructor
 */
qa.TestCase = function() {

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
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.setUp = function(step) {
  this.__setUp = step;
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.addStep = function(step) {
  this.__steps.push(step);
};


/**
 * @param {!qa.TestCase} testCase Задача шага.
 */
qa.TestCase.prototype.addCase = function(testCase) {
  this.addStep(testCase.buildStep());
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.tearDown = function(step) {
  this.__tearDown = step;
};


/**
 * @return {!async.TaskFunction} Дейсвие выполнения сценария.
 */
qa.TestCase.prototype.buildStep = function() {
  var self = this;
  var step = async.sequence(
      [this.__setUp].concat(this.__steps).concat(this.__tearDown));

  return function(data, complete, cancel) {
    step.call(this, self, complete, cancel)
  };
};
