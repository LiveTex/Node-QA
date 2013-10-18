

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


  /**
   * @type {!string}
   * @private
   */
  this.__time = new Date().getTime();

};


/**
 * @return {!string} Время.
 */
qa.report.ReportItem.prototype.getTime = function() {
  return this.__time;
};


/**
 * @return {!string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {!string} Имя записи.
 */
qa.report.ReportItem.prototype.getName = function() {
  return this.__name;
};


qa.report.AssertionItem = function(id, value, name, testCaseName) {


  /**
   * @type {!string}
   */
   this.__id = id;

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


  /**
   * @type {!string}
   * @private
   */
  this.__time = new Date().getTime();

};

util.inherits(qa.report.AssertionItem, qa.report.ReportItem);


/**
 * @return {!string} Время.
 */
qa.report.AssertionItem.prototype.getId = function() {
  return this.__id;
};


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
