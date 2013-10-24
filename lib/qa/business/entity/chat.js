


/**
 * @constructor
 * @implements {qa.business.entity.IChatHolder}
 * @param {!qa.business.entity.Visitor} visitor Chat visitor.
 * @param {!qa.business.entity.Group} group Chat group.
 */
qa.business.Chat = function(visitor, group) {
  /**
   * @type {!qa.business.entity.Visitor}
   */
  this.__visitor = visitor;

  /**
   * @type {!qa.business.entity.Group}
   */
  this.__group = group;

  /**
   * @type {!qa.business.entity.Member}
   */
  this.__member = null;
};


/**
 * @inheritDoc
 */
qa.business.Chat.prototype.getChat = function() {
  return this;
};


/**
 * @inheritDoc
 */
qa.business.Chat.prototype.getVisitor = function() {
  return this.__visitor;
};


/**
 * @inheritDoc
 */
qa.business.Chat.prototype.getGroup = function() {
  return this.__group;
};


/**
 * @param {qa.business.entity.Member} member Current chat member.
 */
qa.business.Chat.prototype.setCurrentMember = function(member) {
  this.__member = member;
};


/**
 * @return {qa.business.entity.Member} Current chat member.
 */
qa.business.Chat.prototype.getCurrentMember = function() {
  return this.__member;
};
