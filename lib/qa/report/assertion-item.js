


/**
 * @constructor
 * @extends {qa.report.ReportItem}
 * @param {!string} id
 * @param {!boolean} value
 * @param {string=} opt_name
 * @param {string=} opt_testCaseName
 */
qa.report.AssertionItem = function(id, value, opt_name, opt_testCaseName) {
  qa.report.ReportItem.call(this,
      qa.report.ReportItemType.ASSERTION_RESULT, opt_name);

  /**
   * @type {string}
   */
  this.__id = id;

  /**
   * @type {boolean}
   */
  this.__value = value;

  /**
   * @type {string|undefined}
   */
  this.__testCaseName = opt_testCaseName;
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
