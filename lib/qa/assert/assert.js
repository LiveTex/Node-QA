

/**
 * @namespace
 */
qa.assert = {};


/**
 * @param {!boolean} value Значение.
 * @param {string=} opt_message Комментарий к утверждению.
 */
qa.assert.ok = function(value, opt_message) {
  qa.report.__reporter.addAssertion(value, opt_message);
};


/**
 * @param {!async.TaskFunction} task
 * @return {!async.TaskFunction}
 */
qa.assert.assertComplete = function(task) {
  return function(data, complete, cancel) {
    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      qa.assert.ok(false);
      cancel(error, opt_code);
    }

    function localComplete(data) {
      qa.assert.ok(true);
      complete(data);
    }

    task(data, localComplete, localCancel);
  }
};


/**
 * @param {!async.TaskFunction} task
 * @return {!async.TaskFunction}
 */
qa.assert.assertCancel = function(task) {
  return function(data, complete, cancel) {
    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      assert(true);
      cancel(error, opt_code);
    }

    function localComplete(data) {
      assert(false);
      complete(data);
    }

    task(data, localComplete, localCancel);
  }
};


/**
 * @param {!async.TaskFunction} task
 * @return {!async.TaskFunction}
 */
qa.assert.reverse = function(task) {
  return function(data, complete, cancel) {
    function localComplete() {
      cancel('Task was REVERSED!');
    }

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      complete(data);
    }

    task(data, localComplete, localCancel);
  }
};
