

/**
 * @param {!string} type
 * @param {!string} name
 * @param {!Object} data
 * @constructor
 */
qa.report.ReportItem = function(type, name, data) {

  /**
   * @type {!string}
   * @private
   */
  this.__type = type;


  /**
   * @type {!string} Имя записи.
   * @private
   */
  this.__name = name;


  /**
   * @type {!Object}
   * @private
   */
  this.__data = data;

};


/**
 * @returns {!string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {
  return this.__type;
}

qa.report.AssertionItem = function(value, name, testCaseName) {

  /**
   * @type {!string}
   * @private
   */
  this.__type = qa.report.ReportItemType.ASSERTION_RESULT;

  /**
   * @type {string=}
   * @private
   */
  this.__name = name;


  /**
   * @type {!boolean}
   * @private
   */
  this.__value = value;


  /**
   * @type {!string}
   * @private
   */
  this.__testCaseName = testCaseName;
};

util.inherits(qa.report.AssertionItem, qa.report.ReportItem);


/**
 * @return {!boolean}
 */
qa.report.AssertionItem.prototype.getValue = function() {
  return this.__value;
};


/**
 * @param {!Array<!qa.report.ReportItem>} items
 * @param {!string} type
 * @return {!Array<!qa.report.ReportItem>}
 */
qa.report.filterItemsByType = function(items, type) {
  return items.filter(function (item) {
    return item.getType() === type;
  })
};


/**
 * @param {qa.report.ReportItem} data
 * @param {!function(*)} complete
 * @constructor
 */
qa.report.AsyncGetType = function (data, complete){
  complete(data.getType());
};
