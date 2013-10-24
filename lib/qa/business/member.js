


/**
 * @implements {qa.business.IMemberHolder}
 * @extends {qa.business.User}
 * @constructor
 * @param {string} login Member`s login name.
 */
qa.business.Member = function(login) {
  qa.business.User.call(this, login);

  /**
   * @type {string}
   */
  this.__login = login;

  /**
   * @type {string}
   */
  this.__password = '';
};

util.inherits(qa.business.Member, qa.business.User);


/**
 * @inheritDoc
 */
qa.business.Member.prototype.getMember = function() {
  return this;
};


/**
 * @return {string} Member`s login name.
 */
qa.business.Member.prototype.getLogin = function() {
  return this.__login;
};


/**
 * @return {string} Member`s password.
 */
qa.business.Member.prototype.getPassword = function() {
  return this.__password;
};


/**
 * @param {string} password Member`s password.
 */
qa.business.Member.prototype.setPassword = function(password) {
  this.__password = password;
};


/**
 * @param {Object} authResponse Auth action response.
 */
qa.business.Member.prototype.populateAuthInfo = function(authResponse) {

};
