


/**
 * @constructor
 * @param {string} type Request type.
 * @param {string} data Request data.
 */
qa.business.Request = function(type, data) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {string}
   */
  this.__data = data;
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
