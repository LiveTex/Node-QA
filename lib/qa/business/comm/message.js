


/**
 * @param {string} type Message type.
 * @param {string} data Message data.
 * @constructor
 */
qa.business.comm.Message = function(type, data) {

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
 * @return {string} Message type.
 */
qa.business.comm.Message.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {string} Message data.
 */
qa.business.comm.Message.prototype.getData = function() {
  return this.__data;
};
