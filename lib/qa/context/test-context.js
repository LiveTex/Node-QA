


/**
 * @constructor
 * @implements {qa.context.ITestContext}
 * @param {string} name Имя.
 */
qa.context.TestContext = function(name) {
  /**
   * @type {!util.SafeObject}
   */
  this.__data = new util.SafeObject({});

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {!Array.<!qa.ReportItem>}
   */
  this.__report = [ new qa.ReportItem(this.__name, 'Start.', true) ];
};


/**
 * @inheritDoc
 */
qa.context.TestContext.prototype.assert = function(assertion, comment) {
  this.__report.push(new qa.ReportItem(this.__name, comment, assertion));
};


/**
 * @inheritDoc
 */
qa.context.TestContext.prototype.exception = function(error, opt_code) {
  this.__report.push(new qa.ReportItem(this.__name, error, false));
};


/**
 * @inheritDoc
 */
qa.context.TestContext.prototype.timeout = function() {
  this.__report.push(new qa.ReportItem(this.__name, 'Timeout.', false));
};


/**
 * @inheritDoc
 */
qa.context.TestContext.prototype.report = function(data) {
  this.__report.push(new qa.ReportItem(this.__name, 'End.', true));

  return this.__report;
};


/**
 * Returns data.
 *
 * @param {...(string|number)} var_args Path to value.
 * @return {string} Data.
 */
qa.context.TestContext.prototype.getString = function(var_args) {
  var result = this.__data.get.apply(this.__data, arguments);
  if (typeof result === 'string') {
    return result;
  }

  this.assert(false, 'Value at \'' +
      util.toArray(arguments).join('/') + '\' is not string. (' + result + ')');

  return '';
};


/**
 * Returns data.
 *
 * @param {...(string|number)} var_args Path to value.
 * @return {number} Data.
 */
qa.context.TestContext.prototype.getNumber = function(var_args) {
  var result = this.__data.get.apply(this.__data, arguments);
  if (typeof result === 'number') {
    return result;
  }

  this.assert(false, 'Value at \'' +
      util.toArray(arguments).join('/') + '\' is not number. (' + result + ')');

  return 0;
};


/**
 * Returns data.
 *
 * @param {...(string|number)} var_args Path to value.
 * @return {boolean} Data.
 */
qa.context.TestContext.prototype.getBoolean = function(var_args) {
  var result = this.__data.get.apply(this.__data, arguments);
  if (typeof result === 'boolean') {
    return result;
  }

  this.assert(false, 'Value at \'' +
      util.toArray(arguments).join('/') + '\' is not bool. (' + result + ')');

  return false;
};


/**
 * Returns data.
 *
 * @param {...(string|number)} var_args Path to value.
 * @return {!Object} Data.
 */
qa.context.TestContext.prototype.getObject = function(var_args) {
  var result = this.__data.get.apply(this.__data, arguments);
  if (result instanceof Object) {
    return result;
  }

  this.assert(false, 'Value at \'' +
      util.toArray(arguments).join('/') + '\' is not object. (' + result + ')');

  return {};
};


/**
 * Returns data.
 *
 * @param {...(string|number)} var_args Path to value.
 * @return {string|number|boolean|Object} Data.
 */
qa.context.TestContext.prototype.get = function(var_args) {
  return this.__data.get.apply(this.__data, arguments);
};


/**
 * Stores data to a key by its path.
 *
 * @param {string|number|boolean|Object} value Data.
 * @param {...(string|number)} var_args Path to value.
 */
qa.context.TestContext.prototype.set = function(value, var_args) {
  this.__data.set.apply(this.__data, arguments);
};

