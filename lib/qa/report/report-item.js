


/**
 * @constructor
 * @param {string} type
 * @param {string} name
 */
qa.report.ReportItem = function(type, name) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {string} Имя записи.
   */
  this.__name = name;

  /**
   * @type {string}
   */
  this.__time = Date.now().toString();
};


/**
 * @return {string} Время.
 */
qa.report.ReportItem.prototype.getTime = function() {
  return this.__time;
};


/**
 * @return {string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {string} Имя записи.
 */
qa.report.ReportItem.prototype.getName = function() {
  return this.__name;
};
