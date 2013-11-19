

/**
 * @namespace
 */
qa.report = {};


/**
 * @type {qa.report.Reporter}
 */
qa.report.__reporter = null;


/**
 * @param {!qa.report.Reporter} reporter Репортер.
 */
qa.report.setReporter = function(reporter) {
  qa.report.__reporter = reporter;
};


/**
 * @return {!qa.report.Reporter|null} reporter Репортер.
 */
qa.report.getReporter = function() {
  return qa.report.__reporter;
};


/**
 * @return {!Array.<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.getReport = function() {
  return qa.report.__reporter.getReport();
};


/**
 * @param {!Array.<!qa.report.ReportItem>} items
 * @param {string} type
 * @return {!Array.<!qa.report.ReportItem>}
 */
qa.report.filterItemsByType = function(items, type) {
  return items.filter(function(item) {
    return item.getType() === type;
  });
};


/**
 * @param {!qa.report.ReportItem} data
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel Обработчик ошибки.
 */
qa.report.asyncGetType = function(data, complete, cancel) {
  complete(data.getType());
};
