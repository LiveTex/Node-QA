


/**
 * @constructor
 * @implements {qa.business.entity.IMemberHolder}
 * @extends {qa.business.entity.User}
 * @param {string} login Member`s login name.
 * @param {string} password Member`s password.
 */
qa.business.entity.Member = function(login, password) {
  qa.business.entity.User.call(this, login);

  /**
   * @type {string}
   */
  this.__login = login;

  /**
   * @type {string}
   */
  this.__password = password;

  /**
   * @type {string}
   */
  this.__id = '';

  /**
   * @type {!Array.<string>}
   */
  this.__sites = [];

  /**
   * @type {!Array.<!qa.business.entity.Visitor>}
   */
  this.__visitors = [];

  /**
   * @type {!Array.<!qa.business.entity.Visitor>}
   */
  this.__chatVisitors = [];

  /**
   * @type {number}
   */
  this.__authStatus = qa.business.MemberAuthStatus.NotAuthenticated;
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
 * @return {number} Member`s auth status.
 */
qa.business.entity.Member.prototype.getAuthStatus = function() {
  return this.__authStatus;
};


/**
 * @param {number} status Member`s status.
 */
qa.business.entity.Member.prototype.setAuthStatus = function(status) {
  this.__authStatus = status;
};


/**
 * @return {!Array.<!qa.business.entity.Visitor>} Visible visitors.
 */
qa.business.entity.Member.prototype.getVisitors = function() {
  return this.__visitors;
};


/**
 * @param {!Array.<!qa.business.entity.Visitor>} visitors Visible visitors.
 */
qa.business.entity.Member.prototype.setVisitors = function(visitors) {
  this.__visitors = visitors;
};


/**
 * @return {!Array.<!qa.business.entity.Visitor>} Visible visitors.
 */
qa.business.entity.Member.prototype.getChatVisitors = function() {
  return this.__chatVisitors;
};


/**
 * @param {!Array.<!qa.business.entity.Visitor>} visitors Visible visitors.
 */
qa.business.entity.Member.prototype.setChatVisitors = function(visitors) {
  this.__chatVisitors = visitors;
};


/**
 * @return {!Object} Auth data.
 */
qa.business.entity.Member.prototype.serializeAuthInfo = function() {
  return {
    'login': this.__login,
    'password': this.__password
  };
};


/**
 * @param {Object} authResponse Auth action response.
 */
qa.business.entity.Member.prototype.populateAuthInfo = function(authResponse) {
  if (typeof authResponse['member_id'] === 'string') {
    this.__id = authResponse['member_id'];
  }

  if (authResponse['site_list'] instanceof Array) {
    this.__sites = authResponse['site_list'];
  }
};
