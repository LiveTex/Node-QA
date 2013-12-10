


/**
 * @constructor
 * @implements {qa.test.IContext}
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя.
 * @param {!qa.test.Context=} opt_parent Имя.
 */
qa.test.Context = function(name, log, opt_parent) {

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {!qa.log.IEventLog}
   */
  this.__log = log;

  /**
   * @type {!util.SafeObject}
   */
  this.__data = new util.SafeObject({});

  /**
   * @type {qa.test.Context}
   */
  this.__parent = opt_parent || null;
};


/**
 * @return {!qa.test.IContext} Корневой контекст.
 */
qa.test.Context.prototype.getRoot = function() {
  if (this.__parent !== null) {
    return this.__parent.getRoot();
  }

  return this;
};


/**
 * @return {qa.test.IContext} Родительский контекст.
 */
qa.test.Context.prototype.getParent = function() {
  return this.__parent;
};


/**
 * @return {string} Имя.
 */
qa.test.Context.prototype.getName = function() {
  return this.__name;
};


/**
 * @return {!util.ISafeObject} Не имя.
 */
qa.test.Context.prototype.getStorage = function() {
  return this.__data;
};


/**
 * @return {!qa.log.IEventLog} Не имя.
 */
qa.test.Context.prototype.getEventLog = function() {
  return this.__log;
};
