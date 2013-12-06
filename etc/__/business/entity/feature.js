


/**
 * @constructor
 * @param {string} memberId Member`s id.
 * @param {string} groupId Group`s id.
 */
qa.business.entity.Feature = function(memberId, groupId) {

  /**
   * @type {string}
   */
  this.__chatMemberId = memberId;

  /**
   * @type {string}
   */
  this.__groupId = groupId;
};


/**
 * @return {string} Member`s id.
 */
qa.business.entity.Feature.prototype.getMemberId = function() {
  return this.__chatMemberId;
};


/**
 * @return {string} Group`s id.
 */
qa.business.entity.Feature.prototype.getGroupId = function() {
  return this.__groupId;
};
