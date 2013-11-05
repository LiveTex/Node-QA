


/**
 * @constructor
 * @implements {qa.business.entity.IMemberHolder}
 * @param {string} login Member`s login name.
 * @param {string} password Member`s password.
 * @param {string=} opt_device_token Device token.
 */
qa.business.entity.Member = function(login, password, opt_device_token) {

  /**
   * @type {string}
   */
  this.__login = login;

  /**
   * @type {string}
   */
  this.__password = password;

  /**
   * @type {string=}
   */
  this.__device_token = opt_device_token;

  /**
   * @type {string}
   */
  this.__id = '';

  /**
   * visitorId: visitor
   * @type {!Object.<string, !qa.business.entity.Visitor>}
   */
  this.__visitors = [];

  /**
   * chatId: visitor
   * @type {!Object.<string, !qa.business.entity.Visitor>}
   */
  this.__chatVisitors = [];

  /**
   * @type {number}
   */
  this.__authStatus = qa.business.MemberAuthStatus.NotAuthenticated;
};


/**
 * @type {string}
 */
qa.business.entity.Member.ANY_MEMBER_ID = '*';


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
 * @return {!Object.<string, !qa.business.entity.Visitor>} Visible visitors.
 */
qa.business.entity.Member.prototype.getVisitors = function() {
  return this.__visitors;
};


/**
 * @param {!Object.<string, !qa.business.entity.Visitor>} visitors
 *   Visible visitors.
 */
qa.business.entity.Member.prototype.setVisitors = function(visitors) {
  this.__visitors = visitors;
};


/**
 * @return {!Object.<string, !qa.business.entity.Visitor>} Chat visitors.
 */
qa.business.entity.Member.prototype.getChatVisitors = function() {
  return this.__chatVisitors;
};


/**
 * @param {!Object.<string, !qa.business.entity.Visitor>} visitors
 *   Chat visitors.
 */
qa.business.entity.Member.prototype.setChatVisitors = function(visitors) {
  this.__chatVisitors = visitors;
};


/**
 * @return {string} Member id.
 */
qa.business.entity.Member.prototype.getId = function() {
  return this.__id;
};


/**
 * @return {string=} Device token.
 */
qa.business.entity.Member.prototype.getDeviceToken = function() {
  return this.__device_token;
};


/**
 * @return {boolean}
 */
qa.business.entity.Member.prototype.isMobile = function() {
  return (typeof this.__device_token === 'string');
};


/**
 * @return {!Object} Auth data.
 */
qa.business.entity.Member.prototype.serializeAuthInfo = function() {
  var authData = {
    'login': this.__login,
    'password': this.__password
  };
  if (this.isMobile()) {
    authData['device_token'] = this.__device_token;
  }
  return authData;
};


/**
 * @param {Object} data Auth action response.
 */
qa.business.entity.Member.prototype.populateAuthInfo = function(data) {
  if (typeof data['member_id'] === 'string') {
    // short id - member doesn't know his account
    this.__id = data['member_id'];
  }
};
