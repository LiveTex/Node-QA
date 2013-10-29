


/**
 * @constructor
 * @implements {qa.business.entity.IChatHolder}
 * @param {!qa.business.entity.Visitor} visitor Chat visitor.
 */
qa.business.entity.Chat = function(visitor) {
  /**
   * @type {!qa.business.entity.Visitor}
   */
  this.__visitor = visitor;

  /**
   * @type {qa.business.entity.Group}
   */
  this.__group = null;

  /**
   * @type {qa.business.entity.Member}
   */
  this.__member = null;
};


/**
 * @inheritDoc
 */
qa.business.entity.Chat.prototype.getChat = function() {
  return this;
};


/**
 * @inheritDoc
 */
qa.business.entity.Chat.prototype.getVisitor = function() {
  return this.__visitor;
};


/**
 * @return {qa.business.entity.Group} Chat group.
 */
qa.business.entity.Chat.prototype.getGroup = function() {
  return this.__group;
};


/**
 * @return {qa.business.entity.Member} Current chat member.
 */
qa.business.entity.Chat.prototype.getMember = function() {
  return this.__member;
};
