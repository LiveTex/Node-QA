

/**
 * @namespace
 */
qa.format = {};


/**
 * @param {!*} node Узел дерева.
 * @param {!Array.<*>} path Путь в дереве.
 * @param {!Object} obj Дерево.
 */
qa.format.addNode = function(node, path, obj) {
  var step = path.shift();
  if (path.length === 0) {
    obj[step] = node;
  } else if ((obj[step] !== null) && (typeof obj[step] === 'object')) {
    qa.format.addNode(node, path, obj[step]);
  }
};


/**
 * @return {!Object} Отчет о тестах в формате JSON.
 */
qa.format.report = function() {
  var path = [];
  var result = {};
  var items = qa.report.__reporter.getReport();
  for (var i in items) {
    var item = items[i];
    switch (item.getType()) {
      case qa.report.ReportItemType.TEST_CASE_STARTED:
        path.push(item.getName());
        qa.format.addNode({}, path.slice(0), result);
        break;
      case qa.report.ReportItemType.TEST_CASE_STOPPED:
        path.pop();
        break;
      case qa.report.ReportItemType.ASSERTION_RESULT:
        qa.format.addNode(item.getValue(),
            path.slice(0).concat('Assertion#' + item.getId()), result);
        break;
    }
  }
  return result;
};


/**
 * @return {!Object} Отчет о тестах в формате JSON.
 */
qa.format.summaryReport = function() {
  var statistics = {
    'tests-passed': 0,
    'tests-failed': 0,
    'assertion-passed': 0,
    'assertion-failed': 0
  };
  var items = qa.report.__reporter.getReport();
  var test_status = true;

  for (var i in items) {
    var item = items[i];
    switch (item.getType()) {
      case qa.report.ReportItemType.TEST_CASE_STARTED:
        test_status = true;
        break;
      case qa.report.ReportItemType.TEST_CASE_STOPPED:
        if (test_status) {
          statistics['tests-passed'] += 1;
        } else {
          statistics['tests-failed'] += 1;
        }
        test_status = true;
        break;
      case qa.report.ReportItemType.ASSERTION_RESULT:
        var assertion_status = item.getValue();
        test_status = test_status && assertion_status;
        if (assertion_status) {
          statistics['assertion-passed'] += 1;
        } else {
          statistics['assertion-failed'] += 1;
        }
        break;
    }
  }
  return statistics;
};
