


/**
 * @param {!string} site
 * @param {string=} opt_polling_channel
 * @param {string=} opt_chat_server_channel
 * @constructor
 */
qa.business.visitor.Visitor =
    function(site, opt_polling_channel, opt_chat_server_channel) {
  /**
   * @type {string}
   */
  this.__site = site;

  /**
   * @type {!string}
   */
  this.__polling_channel = opt_polling_channel;

  /**
   * @type {!string}
   */
  this.__chat_server_channel = opt_chat_server_channel;

  /**
   * @type {string}
   */
  this.__session = '';
};


/**
 * @return {!string}
 */
qa.business.visitor.Visitor.prototype.getSite = function() {
  return this.__site;
};


/**
 * @param {!string} site
 */
qa.business.visitor.Visitor.prototype.setSite = function(site) {
  this.__site = site;
};


/**
 * @return {!string}
 */
qa.business.visitor.Visitor.prototype.getSession = function() {
  return this.__session;
};


/**
 * @param {!string} session
 */
qa.business.visitor.Visitor.prototype.setSession = function(session) {
  this.__session = session;
};


/**
 * @return {!string}
 */
qa.business.visitor.Visitor.prototype.getPollingChannel = function() {
  return this.__polling_channel;
};


/**
 * @param {!string} polling_channel
 */
qa.business.visitor.Visitor.prototype.setPollingChannel =
    function(polling_channel) {
  this.__polling_channel = polling_channel;
};


/**
 * @return {!string}
 */
qa.business.visitor.Visitor.prototype.getChatServerChannel = function() {
  return this.__chat_server_channel;
};


/**
 * @param {!string} chat_server_channel
 */
qa.business.visitor.Visitor.prototype.setChatServerChannel =
    function(chat_server_channel) {
  this.__chat_server_channel = chat_server_channel;
};
