

qa.report.getItemTypeStatistic = function(items, complete) {
  var typeStatistic = {};
  typeStatistic[qa.report.ReportItemType.ASSERTION_RESULT] = 0;
  typeStatistic[qa.report.ReportItemType.TEST_CASE_STARTED] = 0;
  typeStatistic[qa.report.ReportItemType.TEST_CASE_STOPPED] = 0;
  typeStatistic[qa.report.ReportItemType.TEST_STEP_STARTED] = 0;

  complete(items.reduce(
    function(stat, current){
      stat[current] += 1;
      return stat;
    },
    typeStatistic));
};


qa.report.getAssertionStatistic = function(items, complete) {
  var assertionStatistic = {
    ok: 0,
    fail: 0
  };

  complete(items.reduce(
    function(stat, current) {
      if (current.getValue()) {
        stat["ok"] += 1;
      } else {
        stat["fail"] += 1;
      }
      return stat;
    },
    assertionStatistic
  ));
};


qa.report.buildReport = function() {
  async.sequence([
    async.each(qa.report.AsyncGetType),
    qa.report.getItemTypeStatistic
  ])(qa.report.__reporter.getReport(),
     qa.report.printSummaryReport,
     console.log);
  async.sequence([
    qa.report.getAssertionStatistic
  ])(qa.report.filterItemsByType(
      qa.report.__reporter.getReport(),
      qa.report.ReportItemType.ASSERTION_RESULT
     ),
     qa.report.printAssertionReport,
     console.log
    );
};


qa.report.printSummaryReport = function(stat) {
  console.log("------- SUMMARY -------");
  console.log(stat[qa.report.ReportItemType.TEST_CASE_STARTED] + " tests, " +
              stat[qa.report.ReportItemType.TEST_CASE_STOPPED] + " successful, " +
              (stat[qa.report.ReportItemType.TEST_CASE_STARTED] -
              stat[qa.report.ReportItemType.TEST_CASE_STOPPED]) + " fail. ");
};

qa.report.printAssertionReport = function(stat) {
  var logger = undefined;
  if (stat["fail"] > 0) {
    logger = console.warn;
  } else {
    logger = console.error;
  }

  logger(stat["ok"] + " assertions, " + stat["fail"] + " fail.");
};
