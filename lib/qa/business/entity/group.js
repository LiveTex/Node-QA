


/**
 * @param {string} id Group identifier.
 * @param {string} site Full site identifier.
 * @constructor
 */
qa.business.entity.Group = function(id, site) {

  /**
   * @type {string}
   */
  this.__id = id;

  /**
   * @type {string}
   */
  this.__site = site;
};


/**
 * @return {string} Group identifier.
 */
qa.business.entity.Group.prototype.getId = function() {
  return this.__id;
};


/**
 * @return {string} Full site identifier.
 */
qa.business.entity.Group.prototype.getSite = function() {
  return this.__site;
};
