


/**
 * @constructor
 */
qa.business.Application = function() {

  /**
   * @type {!Array.<qa.business.IConnection>}
   */
  this.__connections = [];
};


/**
 * @param {string} name Connection name.
 * @param {qa.business.IConnection} connection Connection.
 */
qa.business.Application.prototype.attachConnection =
    function(name, connection) {
  this.__connections[name] = connection;
};


/**
 * @param {string} name Connection name.
 * @return {qa.business.IConnection} Connection.
 */
qa.business.Application.prototype.getConnectionByName = function(name) {
  return this.__connections[name] || null;
};


/**
 * @param {qa.business.User} user User.
 * @return {qa.business.IConnection} Connection.
 */
qa.business.Application.prototype.getConnectionByUser = function(user) {
  return this.getConnectionByName(user.getName());
};


/**
 * @param {string} name Connection name.
 */
qa.business.Application.prototype.detachConnection = function(name) {
  delete this.__connections[name];
};
