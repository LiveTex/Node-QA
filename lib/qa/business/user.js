


/**
 * @constructor
 * @param {string} name User`s name.
 */
qa.business.User = function(name) {

  /**
   * @type {string}
   */
  this.__name = name;
};


/**
 * @return {string} User`s name.
 */
qa.business.User.prototype.getName = function() {
  return this.__name;
};
