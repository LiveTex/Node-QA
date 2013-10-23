

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
