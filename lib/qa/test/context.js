


/**
 * @constructor
 * @implements {qa.test.IContext}
 * @param {string} name Имя.
 * @param {!qa.test.IContext} parent Имя.
 */
qa.test.Context = function(name, parent) {

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {!qa.test.IContext}
   */
  this.__parent = parent;

  /**
   * @type {!qa.db.Node}
   */
  this.__dataNode = parent.getDataNode().growChild(name);
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.passResult = function(result, tag, opt_tags) {
  var tags = [this.__name];
  if (opt_tags !== undefined) {
    tags = opt_tags.concat(tags);
  }

  this.__parent.passResult(result, tag, tags);
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.getDataNode = function() {
  return this.__dataNode;
};
