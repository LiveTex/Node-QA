

/**
 * @param {string} barrierId Unique barrier id.
 * @param {number=} opt_weight Number of participants to weight, default = 2.
 * @return {!async.TaskFunction} Barrier task function.
 */
qa.business.utils.async.barrier = function(barrierId, opt_weight) {
  return function(data, complete, cancel) {
    function localComplete(localData) {
      console.info(barrierId);
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
