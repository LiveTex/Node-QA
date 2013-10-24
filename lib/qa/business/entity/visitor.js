


/**
 * @param {!string} site
 * @constructor
 */
qa.business.entity.Visitor = function(site) {
  /**
   * @type {string}
   */
  this.__site = site;

  /**
   * @type {string}
   */
  this.__polling_channel = null;

  /**
   * @type {string}
   */
  this.__chat_server_channel = null;

  /**
   * @type {string}
   */
  this.__io_channel = null;

  /**
   * @type {string}
   */
  this.__session = null;
};


/**
 * @return {!string}
 */
qa.business.entity.Visitor.prototype.getSite = function() {
  return this.__site;
};


/**
 * @param {!string} site
 */
qa.business.entity.Visitor.prototype.setSite = function(site) {
  this.__site = site;
};


/**
 * @return {!string}
 */
qa.business.entity.Visitor.prototype.getSession = function() {
  return this.__session;
};


/**
 * @param {!string} session
 */
qa.business.entity.Visitor.prototype.setSession = function(session) {
  this.__session = session;
};


/**
 * @return {!string}
 */
qa.business.entity.Visitor.prototype.getPollingChannel = function() {
  return this.__polling_channel;
};


/**
 * @param {!string} polling_channel
 */
qa.business.entity.Visitor.prototype.setPollingChannel =
    function(polling_channel) {
  this.__polling_channel = polling_channel;
};


/**
 * @return {!string}
 */
qa.business.entity.Visitor.prototype.getChatServerChannel = function() {
  return this.__chat_server_channel;
};


/**
 * @param {!string} chat_server_channel
 */
qa.business.entity.Visitor.prototype.setChatServerChannel =
    function(chat_server_channel) {
  this.__chat_server_channel = chat_server_channel;
};


/**
 * @return {string}
 */
qa.business.entity.Visitor.prototype.getIoAuthChannel = function() {
  return this.__io_channel;
};


/**
 * @param {string} io_channel
 */
qa.business.entity.Visitor.prototype.setIoAuthChannel = function(io_channel) {
  this.__io_channel = io_channel;
};


/**
 * @return {string} Short site id.
 */
qa.business.entity.Visitor.prototype.getShortSiteId = function() {
  var ids = this.__site.split(':');
  return ids[ids.length - 1];
};


/**
 * @return {qa.business.entity.Visitor}
 */
qa.business.entity.Visitor.prototype.getVisitor = function() {
  return this;
};
