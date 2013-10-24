


/**
 * @implements {qa.business.entity.IMemberHolder}
 * @extends {qa.business.entity.User}
 * @constructor
 * @param {string} login Member`s login name.
 */
qa.business.entity.Member = function(login) {
  qa.business.entity.User.call(this, login);

  /**
   * @type {string}
   */
  this.__login = login;

  /**
   * @type {string}
   */
  this.__password = '';
};

util.inherits(qa.business.entity.Member, qa.business.entity.User);


/**
 * @inheritDoc
 */
qa.business.entity.Member.prototype.getMember = function() {
  return this;
};


/**
 * @return {string} Member`s login name.
 */
qa.business.entity.Member.prototype.getLogin = function() {
  return this.__login;
};


/**
 * @return {string} Member`s password.
 */
qa.business.entity.Member.prototype.getPassword = function() {
  return this.__password;
};


/**
 * @param {string} password Member`s password.
 */
qa.business.entity.Member.prototype.setPassword = function(password) {
  this.__password = password;
};


/**
 * @param {Object} authResponse Auth action response.
 */
qa.business.entity.Member.prototype.populateAuthInfo = function(authResponse) {

};
