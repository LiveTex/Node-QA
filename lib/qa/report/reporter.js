
/**
 * @constructor
 */
qa.report.Reporter = function() {

  /**
   * @type {!Array<!qa.report.ReportItem>}
   * @private
   */
  this.__items = [];

  /**
   * @type {number}
   * @private
   */
  this.__assertionCounter = 0

};


/**
 * Добавляет утверждение в журнал.
 * @param {!boolean} value Истинность утверждения.
 * @param {!string} name Утверждение.
 */
qa.report.Reporter.prototype.addAssertion = function(value, name) {
  this.__assertionCounter += 1;
  this.__items.push(new qa.report.AssertionItem(String(this.__assertionCounter), value, name));
};


/**
 * @returns {!Array<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.Reporter.prototype.getReport = function() {
  return this.__items;
};


/**
 * @param name
 */
qa.report.Reporter.prototype.caseStarted = function(name) {
  this.__items.push(new qa.report.ReportItem(
    qa.report.ReportItemType.TEST_CASE_STARTED,
    name,
    {}
  ));
};


/**
 * @param name
 */
qa.report.Reporter.prototype.caseStopped = function(name) {
  this.__items.push(new qa.report.ReportItem(
    qa.report.ReportItemType.TEST_CASE_STOPPED,
    name,
    {}
  ));
};