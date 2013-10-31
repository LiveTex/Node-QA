


/**
 * @constructor
 * @implements {qa.business.entity.IVisitorHolder}
 * @param {string} siteId Full site identifier.
 */
qa.business.entity.Visitor = function(siteId) {
  /**
   * @type {string}
   */
  this.__id = '';

  /**
   * @type {string}
   */
  this.__siteId = siteId;

  /**
   * @type {string}
   */
  this.__chatId = '';

  /**
   * @type {string}
   */
  this.__chatMemberId = '';

  /**
   * @type {boolean}
   */
  this.__hasOnlineChat = false;

  /**
   * @type {string}
   */
  this.__session = '';

  /**
   * @type {qa.business.entity.Feature}
   */
  this.__feature = null;

  /**
   * @type {string}
   */
  this.__name = 'Script visitor';
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
 * @return {string} Short site id.
 */
qa.business.entity.Visitor.prototype.getShortSiteId = function() {
  var ids = this.__siteId.split(':');
  return ids[ids.length - 1];
};


/**
 * @return {string} Visitor full id.
 */
qa.business.entity.Visitor.prototype.getId = function() {
  return this.__id;
};


/**
 * @return {string} Visitor chat id.
 */
qa.business.entity.Visitor.prototype.getChatId = function() {
  return this.__chatId;
};


/**
 * @return {qa.business.entity.Feature} Chat feature.
 */
qa.business.entity.Visitor.prototype.getFeature = function() {
  return this.__feature;
};


/**
 * @param {!qa.business.entity.Feature} feature Chat feature.
 */
qa.business.entity.Visitor.prototype.setFeature = function(feature) {
  this.__feature = feature;
};


/**
 * @return {string} Visitor name.
 */
qa.business.entity.Visitor.prototype.getName = function() {
  return this.__name;
};


/**
 * @return {boolean} Has online chat?
 */
qa.business.entity.Visitor.prototype.hasOnlineChat = function() {
  return this.__hasOnlineChat;
};


/**
 * @param {boolean} hasOnlineChat Has online chat?
 */
qa.business.entity.Visitor.prototype.setHasOnlineChat =
    function(hasOnlineChat) {
  this.__hasOnlineChat = hasOnlineChat;
};


/**
 * @return {string} Visitor chat member id.
 */
qa.business.entity.Visitor.prototype.getChatMemberId = function() {
  return this.__chatMemberId;
};


/**
 * Removes all chat info from the visitor.
 */
qa.business.entity.Visitor.prototype.removeActiveChat = function() {
  this.__chatMemberId = '';
  this.__chatId = '';
  this.__hasOnlineChat = false;
};


/**
 * @inheritDoc
 */
qa.business.entity.Visitor.prototype.getVisitor = function() {
  return this;
};


/**
 * @return {!Object} Serialized visitor.
 */
qa.business.entity.Visitor.prototype.serializeWebAuth = function() {
  return {
    'site': this.__siteId,
    'referrer': '',
    'page_title': '',
    'page_url': '',
    'seo_engine': '',
    'seo_query': '',
    'seo_referrer': '',
    'is_mobile': false
  };
};


/**
 * @param {!Object} data Visitor data.
 */
qa.business.entity.Visitor.prototype.populateWebAuth = function(data) {
  if (Object.keys(data).length === 1) {
    var sessionId = Object.keys(data)[0];
    this.__id = sessionId.slice(0, sessionId.indexOf(':visitor-session'));
  }
};


/**
 * @param {!Object} chat Chat data.
 */
qa.business.entity.Visitor.prototype.populateChatInfo = function(chat) {
  if (typeof chat['chat_id'] === 'string') {
    this.__chatId = chat['chat_id'];
  }

  if (typeof chat['member_id'] === 'string') {
    this.__chatMemberId = chat['member_id'];
  }

  if (typeof chat['flag_online'] === 'number') {
    this.__hasOnlineChat = chat['flag_online'] === 1;
  }

  if (typeof chat['visitor_id'] === 'string') {
    this.__id = qa.business.utils.decodeChatServerVisitorId(chat['visitor_id']);
  }
};


/**
 * @param {!Object} chat Chat data.
 */
qa.business.entity.Visitor.prototype.populateChatResponse = function(chat) {
  if (typeof chat['chat_id'] === 'string') {
    this.__chatId = chat['chat_id'];
  }

  if (typeof chat['target_member_id'] === 'string') {
    this.__chatMemberId = chat['target_member_id'];
  }

  this.__hasOnlineChat = true;
};


/**
 * @param {!Object} chat Chat data.
 */
qa.business.entity.Visitor.prototype.populateVisitorInfo = function(chat) {
  if (typeof chat['chat_member_id'] === 'string') {
    this.__chatMemberId = chat['chat_member_id'];
    this.__hasOnlineChat = chat['chat_member_id'] !== '1';
  }

  if (typeof chat['visitor_id'] === 'string') {
    this.__id = qa.business.utils.decodeChatServerVisitorId(chat['visitor_id']);
  }
};
