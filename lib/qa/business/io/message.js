


/**
 * @constructor
 * @param {string} type Message type.
 * @param {*} data Message data.
 */
qa.business.io.Message = function(type, data) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {*}
   */
  this.__data = data;
};


/**
 * @return {string} Message type.
 */
qa.business.io.Message.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {*} Message data.
 */
qa.business.io.Message.prototype.getData = function() {
  return this.__data;
};
