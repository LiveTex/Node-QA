

/**
 * @param {string} barrierId Unique barrier id.
 * @param {number=} opt_weight Number of participants to weight, default = 2.
 * @return {!async.TaskFunction} Barrier task function.
 */
qa.business.utils.async.barrier = function(barrierId, opt_weight) {
  return function(data, complete, cancel) {
    function localComplete(localData) {
      console.log(barrierId);
      complete(data);
    }
    exec.barrier.hold(barrierId, localComplete, cancel, opt_weight);
  }
};


/**
 * @param {number} delay Time delay.
 * @return {!async.TaskFunction} Async function for the delay.
 */
qa.business.utils.async.delayActor = function(delay) {
  return function(data, complete, cancel) {
    setTimeout(function() {
      complete(data);
    }, delay);
  }
};


/**
 * @param {string} text Text to show before logging data.
 * @return {!async.TaskFunction} Logging task function.
 */
qa.business.utils.async.log = function(text) {
  return function(data, complete, cancel) {
    console.log(text + ': ', data, '\n');
    complete(data);
  }
};
