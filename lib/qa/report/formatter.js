


qa.report.__addNode = function(node, path, obj) {
  var step = path.shift();
  if (path.length === 0) {
    obj[step] = node;
  } else if ((obj[step] !== null) && (typeof obj[step] === 'object')) {
    qa.report.__addNode(node, path, obj[step]);
  }
};


/**
 * @returns {!JSON} Отчет о тестах в формате JSON.
 */
qa.report.JSONReport = function() {
  var path = [];
  var result = {};
  var items = qa.report.__reporter.getReport();
  for (var i in items) {
    var item = items[i];
    switch (item.getType()) {
      case qa.report.ReportItemType.TEST_CASE_STARTED:
        path.push(item.getName());
        qa.report.__addNode({}, path.slice(0), result);
        break;
      case qa.report.ReportItemType.TEST_CASE_STOPPED:
        path.pop();
        break;
      case qa.report.ReportItemType.ASSERTION_RESULT:
        qa.report.__addNode(item.getValue(), path.slice(0).concat("Assertion#" + item.getId()), result);
        break;
    }
  }
  return result;
};
