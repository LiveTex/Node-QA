


/**
 * @constructor
 */
qa.business.app.Application = function() {

  /**
   * @type {!Array.<qa.business.comm.IConnection>}
   */
  this.__connections = [];
};


/**
 * @param {string} name Connection name.
 * @param {qa.business.comm.IConnection} connection Connection.
 */
qa.business.app.Application.prototype.attachConnection =
    function(name, connection) {
  this.__connections[name] = connection;
};


/**
 * @param {string} name Connection name.
 * @return {qa.business.comm.IConnection} Connection.
 */
qa.business.app.Application.prototype.getConnectionByName = function(name) {
  return this.__connections[name] || null;
};


/**
 * @param {qa.business.entity.User} user User.
 * @return {qa.business.comm.IConnection} Connection.
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
