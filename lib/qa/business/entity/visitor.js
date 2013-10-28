


/**
 * @constructor
 * @implements {qa.business.entity.IVisitorHolder}
 * @extends {qa.business.entity.User}
 * @param {string} site Full site identifier.
 */
qa.business.entity.Visitor = function(site) {
  qa.business.entity.User.call(this, 'Гость');
  /**
   * @type {string}
   */
  this.__id = '';

  /**
   * @type {string}
   */
  this.__site = site;

  /**
   * @type {string}
   */
  this.__session = '';
};


util.inherits(qa.business.entity.Visitor, qa.business.entity.User);


/**
 * @return {string} Full site identifier.
 */
qa.business.entity.Visitor.prototype.getSite = function() {
  return this.__site;
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
 * @return {string} Chat server connection name.
 */
qa.business.entity.Visitor.prototype.getChatServerName = function() {
  if (this.__id === '') {
    console.error('trying to get chat name of not authorized visitor');
  }
  return 'chat:' + this.__id;
};


/**
 * @return {string} Livetex server connection name.
 */
qa.business.entity.Visitor.prototype.getLivetexServerName = function() {
  if (this.__id === '') {
    console.error('trying to get livetex name of not authorized visitor');
  }
  return 'livetex:' + this.__id;
};


/**
 * @return {string} Short site id.
 */
qa.business.entity.Visitor.prototype.getShortSiteId = function() {
  var ids = this.__site.split(':');
  return ids[ids.length - 1];
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
qa.business.entity.Visitor.prototype.serialize = function() {
  return {
    'site': this.getSite(),
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
qa.business.entity.Visitor.prototype.populate = function(data) {
  if (Object.keys(data).length === 1) {
    var sessionId = Object.keys(data)[0];
    this.__id = sessionId.slice(0, sessionId.indexOf(':visitor-session'));
  }
};
