


/**
 * @constructor
 */
qa.report.Reporter = function() {

  /**
   * @type {!Array.<!qa.report.ReportItem>}
   */
  this.__items = [];

  /**
   * @type {number}
   */
  this.__assertionCounter = 0;

};


/**
 * Добавляет утверждение в журнал.
 * @param {!boolean} value Истинность утверждения.
 * @param {string=} opt_name Утверждение.
 */
qa.report.Reporter.prototype.addAssertion = function(value, opt_name) {
  this.__assertionCounter += 1;
  this.__items.push(
      new qa.report.AssertionItem(String(this.__assertionCounter),
      value, opt_name));
};


/**
 * @return {!Array.<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.Reporter.prototype.getReport = function() {
  return this.__items;
};


/**
 * @param {string} name Имя.
 */
qa.report.Reporter.prototype.caseStarted = function(name) {
  this.__items.push(new qa.report.ReportItem(
      qa.report.ReportItemType.TEST_CASE_STARTED,
      name));
};


/**
 * @param {string} name Имя.
 */
qa.report.Reporter.prototype.caseStopped = function(name) {
  this.__items.push(new qa.report.ReportItem(
      qa.report.ReportItemType.TEST_CASE_STOPPED,
      name));
};
