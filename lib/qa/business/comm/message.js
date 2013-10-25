


/**
 * @constructor
 * @param {string} type Message type.
 * @param {*} data Message data.
 */
qa.business.comm.Message = function(type, data) {

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
qa.business.comm.Message.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {*} Message data.
 */
qa.business.comm.Message.prototype.getData = function() {
  return this.__data;
};
