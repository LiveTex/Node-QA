


/**
 * @constructor
 * @param {string} type Request type.
 * @param {string} data Request data.
 */
qa.business.Response = function(type, data) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {string}
   */
  this.__data = data;

  /**
   * @type {boolean}
   */
  this._isError = false;

  /**
   * @type {string}
   */
  this._errorText = '';
};


/**
 * @return {string} Request type.
 */
qa.business.Response.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {string} Request data.
 */
qa.business.Response.prototype.getData = function() {
  return this.__data;
};


/**
 * @return {boolean} Is error?
 */
qa.business.Response.prototype.isError = function() {
  return this._isError;
};


/**
 * @return {string} Error description.
 */
qa.business.Response.prototype.getErrorText = function() {
  return this._errorText;
};


/**
 * @param {string} packetData Response packet data.
 * @return {qa.business.Response} Response object.
 */
qa.business.Response.decode = function(packetData) {
  return null;
};
