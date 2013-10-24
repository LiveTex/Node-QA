


/**
 * @constructor
 * @param {string} type Message type.
 * @param {!Object} data Message data.
 */
qa.business.comm.Message = function(type, data) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {!Object}
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
 * @return {!Object} Message data.
 */
qa.business.comm.Message.prototype.getData = function() {
  return this.__data;
};


/**
 * @return {string} Encoded message.
 */
qa.business.comm.Message.prototype.encode = function() {
  return util.encodeJsonData(this.__data);
};
