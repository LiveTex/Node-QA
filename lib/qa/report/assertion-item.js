


/**
 * @constructor
 * @param id
 * @param value
 * @param name
 * @param testCaseName
 */
qa.report.AssertionItem = function(id, value, name, testCaseName) {
  qa.report.ReportItem.call(this,
      qa.report.ReportItemType.ASSERTION_RESULT, name);

  /**
   * @type {string}
   */
   this.__id = id;

  /**
   * @type {boolean}
   */
  this.__value = value;

  /**
   * @type {string}
   */
  this.__testCaseName = testCaseName;
};

util.inherits(qa.report.AssertionItem, qa.report.ReportItem);


/**
 * @return {string} Время.
 */
qa.report.AssertionItem.prototype.getId = function() {
  return this.__id;
};


/**
 * @return {boolean}
 */
qa.report.AssertionItem.prototype.getValue = function() {
  return this.__value;
};
