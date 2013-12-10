


/**
 * @constructor
 * @param {string} name Имя.
 * @param {string} comment Комметарий.
 * @param {boolean} isOk Ок.
 */
qa.ReportItem = function(name, comment, isOk) {

  /**
   * @type {string}
   */
  this.__comment = comment;

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {string}
   */
  this.__okMark = isOk ? '\033[32m \u2714' : '\033[31m \u2718';
};


/**
 * @inheritDoc
 */
qa.ReportItem.prototype.toString = function() {
  return this.__okMark + ' [' + this.__name + ']: ' + this.__comment + '\033[0m';
};