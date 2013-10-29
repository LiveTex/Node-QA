


/**
 * @constructor
 */
qa.business.app.Application = function() {

  /**
   * @type {!Array.<qa.business.io.IConnection>}
   */
  this.__connections = [];

  /**
   * @type {string}
   */
  this.__ioHost = '';

  /**
   * @type {string}
   */
  this.__chatHost = '';
};


/**
 * @param {string} name Connection name.
 * @param {qa.business.io.IConnection} connection Connection.
 */
qa.business.app.Application.prototype.attachConnection =
    function(name, connection) {
  this.__connections[name] = connection;
};


/**
 * @param {string} name Connection name.
 * @return {qa.business.io.IConnection} Connection.
 */
qa.business.app.Application.prototype.getConnectionByName = function(name) {
  return this.__connections[name] || null;
};


/**
 * @param {qa.business.entity.User} user User.
 * @return {qa.business.io.IConnection} Connection.
 */
qa.business.app.Application.prototype.getConnectionByUser = function(user) {
  return this.getConnectionByName(user.getName());
};


/**
 * @param {string} name Connection name.
 */
qa.business.app.Application.prototype.detachConnection = function(name) {
  delete this.__connections[name];
};


/**
 * @return {string} Livetex IO host.
 */
qa.business.app.Application.prototype.getLivetexIoHost = function() {
  return this.__ioHost;
};


/**
 * @param {string} host Livetex IO host.
 */
qa.business.app.Application.prototype.setLivetexIoHost = function(host) {
  this.__ioHost = host;
};


/**
 * @return {string} Chat server host.
 */
qa.business.app.Application.prototype.getChatServerHost = function() {
  return this.__chatHost;
};


/**
 * @param {string} host Chat server host.
 */
qa.business.app.Application.prototype.setChatServerHost = function(host) {
  this.__chatHost = host;
};
