


/**
 * @constructor
 * @extends {qa.state.Cursor}
 * @implements {qa.ext.IClientLibrary}
 * @implements {qa.result.folder.IFolder}
 *
 * @param {string} name Имя.
 * @param {!qa.result.folder.IFolder} parent Родительский узел данных.
 * @param {!qa.state.Tree=} opt_stateCore Родительский узел данных.
 */
qa.result.folder.Case = function(name, parent, opt_stateCore) {
  qa.state.Cursor.call(this, opt_stateCore || {},
      opt_stateCore ? [name] : [], this, this);

  /**
   * @type {!qa.result.folder.IFolder}
   */
  this.__parent = parent;

  /**
   * @type {!qa.result.IResult}
   */
  this.__result = new qa.result.Base();

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {!Object.<qa.ext.ClientName, !qa.ext.IClient>}
   */
  this.__clients = {};
};

util.inherits(qa.result.folder.Case, qa.state.Cursor);


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.registerClient = function(name, client) {
  this.__clients[name] = client;
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.getClient = function(name) {
  return this.__clients[name] || null;
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.terminateClient = function(name) {
  var self = this;

  var client = this.__clients[name];
  if (client !== undefined) {
    client.addListener('destroy', function() {
      client.removeAllListeners();

      if (client === self.__clients[name]) {
        delete self.__clients[name];
      }
    });

    client.destroy(true);
  }
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.terminateAllClients = function() {
  for (var name in this.__clients) {
    this.terminateClient(name);
  }
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.createChild = function(name) {
  return new qa.result.folder.Case(name, this, this.getCore());
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.processState = function(tags) {
  this.__parent.addResult(this.__result, [this.__name].concat(tags));
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.addResult = function(result, tags) {
  this.__result = new qa.result.Union(result, this.__result);
  this.__parent.addResult(result, [this.__name].concat(tags));
};


/**
 * @inheritDoc
 */
qa.result.folder.Case.prototype.getResult = function() {
  return this.__result;
};
