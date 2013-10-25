


/**
 * @constructor
 * @param {string} site Full site identifier.
 */
qa.business.entity.Visitor = function(site) {
  /**
   * @type {string}
   */
  this.__site = site;

  /**
   * @type {string}
   */
  this.__pollingConnection = '';

  /**
   * @type {string}
   */
  this.__chatConnection = '';

  /**
   * @type {string}
   */
  this.__ioConnection = '';

  /**
   * @type {string}
   */
  this.__session = '';
};


/**
 * @return {string} Full site identifier.
 */
qa.business.entity.Visitor.prototype.getSite = function() {
  return this.__site;
};


/**
 * @param {string} site Full site identifier.
 */
qa.business.entity.Visitor.prototype.setSite = function(site) {
  this.__site = site;
};


/**
 * @return {string} Session identifier.
 */
qa.business.entity.Visitor.prototype.getSession = function() {
  return this.__session;
};


/**
 * @param {string} session Session identifier.
 */
qa.business.entity.Visitor.prototype.setSession = function(session) {
  this.__session = session;
};


/**
 * @return {string} Polling connection name.
 */
qa.business.entity.Visitor.prototype.getPollingConnection = function() {
  return this.__pollingConnection;
};


/**
 * @param {string} name Polling connection name.
 */
qa.business.entity.Visitor.prototype.setPollingConnection =
    function(name) {
  this.__pollingConnection = name;
};


/**
 * @return {string} Chat server connection name.
 */
qa.business.entity.Visitor.prototype.getChatServerConnection = function() {
  return this.__chatConnection;
};


/**
 * @param {string} name Chat server connection name.
 */
qa.business.entity.Visitor.prototype.setChatServerConnection =
    function(name) {
  this.__chatConnection = name;
};


/**
 * @return {string} IO auth connection name.
 */
qa.business.entity.Visitor.prototype.getIoAuthConnection = function() {
  return this.__ioConnection;
};


/**
 * @param {string} name IO auth connection name.
 */
qa.business.entity.Visitor.prototype.setIoAuthChannel = function(name) {
  this.__ioConnection = name;
};


/**
 * @return {string} Short site id.
 */
qa.business.entity.Visitor.prototype.getShortSiteId = function() {
  var ids = this.__site.split(':');
  return ids[ids.length - 1];
};


/**
 * @return {qa.business.entity.Visitor} Visitor object.
 */
qa.business.entity.Visitor.prototype.getVisitor = function() {
  return this;
};
