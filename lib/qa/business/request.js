


/**
 * @constructor
 * @param {string} type Request type.
 * @param {string} data Request data.
 * @param {string=} opt_path Request path.
 */
qa.business.Request = function(type, data, opt_path) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {string}
   */
  this.__data = data;

  /**
   * @type {string}
   */
  this.__path = opt_path;
};


/**
 * @return {string} Request type.
 */
qa.business.Request.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {string} Request data.
 */
qa.business.Request.prototype.getData = function() {
  return this.__data;
};


/**
 * @return {string} Request path.
 */
qa.business.Request.prototype.getPath = function() {
  return this.__path;
};
