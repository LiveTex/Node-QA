


/**
 * @constructor
 * @implements {qa.test.IContext}
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя.
 * @param {!qa.db.Node} node Имя.
 */
qa.test.Context = function(name, log, node) {

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {!qa.log.IEventLog}
   */
  this.__log = log;

  /**
   * @type {!qa.db.Node}
   */
  this.__data = node;
};


/**
 * @return {string} Имя.
 */
qa.test.Context.prototype.getName = function() {
  return this.__name;
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.getDataNode = function() {
  return this.__data;
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.getEventLog = function() {
  return this.__log;
};
