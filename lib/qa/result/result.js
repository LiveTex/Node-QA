

/**
 * @typedef {?(number|string)}
 */
qa.result.Tag;


/**
 * @typedef {Array.<!qa.result.Tag>|qa.result.Tag}
 */
qa.result.Tags;


/**
 * @return {!qa.result.Exception} Результат ошибки.
 */
qa.result.exception = function() {
  return new qa.result.Exception();
};


/**
 * @param {boolean} value Значение истинности утверждения.
 * @return {!qa.result.Assertion} Результат ошибки.
 */
qa.result.assertion = function(value) {
  return new qa.result.Assertion(value);
};
