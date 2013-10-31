


/**
 * @constructor
 * @param {string} livetexIoHost Livetex IO hostname.
 * @param {!ts.Slave} chatSlave Chat server slave.
 */
qa.business.io.VisitorSession = function(livetexIoHost, chatSlave) {

  /**
   * @type {!ts.Slave}
   */
  this.__chatSlave = chatSlave;

  /**
   * @type {string}
   */
  this.__livetexIoHost = livetexIoHost;

  /**
   * @type {qa.business.io.ChatServerConnection}
   */
  this.__chatServerConnection = null;

  /**
   * @type {qa.business.io.LivetexServerConnection}
   */
  this.__livetexIoConnection = null;
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Member holder.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.VisitorSession.prototype.auth =
    function(holder, complete, cancel) {
  if (this.__livetexIoConnection !== null) {
    console.warn('Creating a new livetex connection while old still exists. ' +
        '[qa.business.io.VisitorSession#auth]');
  }

  var visitor = holder.getVisitor();
  this.__livetexIoConnection = new qa.business.io.LivetexServerConnection(
      visitor, this.__livetexIoHost, function(data) {
        if (data instanceof Object &&
            data['body'] instanceof Object &&
            typeof data['session'] === 'string') {
          visitor.setSession(data['session']);
          complete(data['body']);
        } else {
          cancel('Wrong auth response [qa.business.io.VisitorSession#auth]: ' +
              util.encodeJsonData(data));
        }
      });
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Member holder.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.VisitorSession.prototype.chatAuth =
    function(holder, complete, cancel) {
  if (this.__chatServerConnection !== null) {
    console.warn('Creating a new visitor chat connection ' +
        'while old still exists. [qa.business.io.VisitorSession#chatAuth]');
  }

  var visitor = holder.getVisitor();
  this.__chatServerConnection =
      new qa.business.io.ChatServerConnection(this.__chatSlave);
  this.__chatServerConnection.request('auth', {
    'source': 'web',
    'session': visitor.getSession(),
    'site_id': visitor.getShortSiteId()
  }, function(data) {
    complete(data);
  }, cancel);
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!Object)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.VisitorSession.prototype.openChat =
    function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  this.__chatServerConnection.request('chat_open', {
    'visitor_name': visitor.getName(),
    'chat_attr_value_id': 0,
    'attributes': {},
    'visitor_attributes': {},
    'open_page': '',
    'group_id': visitor.getFeature().getGroupId()
  }, function(data) {
    if (typeof data['errno'] === 'number') {
      complete(data);
    } else {
      cancel('Wrong chat_open response ' +
          '[qa.business.io.VisitorSession#openChat]: ' +
          util.encodeJsonData(data));
    }
  }, cancel, 'chat');
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!Object)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.VisitorSession.prototype.reopenChat =
    function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  this.__chatServerConnection.request('chat_reopen', {
    'visitor_name': visitor.getName()
  }, function(data) {
    if (typeof data['errno'] === 'number') {
      complete(data);
    } else {
      cancel('Wrong chat_reopen response ' +
          '[qa.business.io.VisitorSession#reopenChat]: ' +
          util.encodeJsonData(data));
    }
  }, cancel, 'chat');
};


/**
 * Closes livetex server connection.
 */
qa.business.io.VisitorSession.prototype.livetexDisconnect = function() {
  if (this.__livetexIoConnection !== null) {
    this.__livetexIoConnection.destroy();
    this.__livetexIoConnection = null;
  }
};


/**
 * Closes chat server connection.
 */
qa.business.io.VisitorSession.prototype.chatDisconnect = function() {
  if (this.__chatServerConnection !== null) {
    this.__chatServerConnection.destroy();
    this.__chatServerConnection = null;
  }
};


/**
 * @param {!qa.business.entity.IVisitorHolder} holder Member holder.
 * @param {function(!Object)} complete Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.io.VisitorSession.prototype.waitForChat =
    function(holder, complete, cancel) {
  this.__chatServerConnection.setCallback('chat', function(data) {
    if (typeof data['errno'] === 'number') {
      complete(data);
    } else {
      cancel('Received wrong chat notification ' +
          '[qa.business.io.VisitorSession#waitForChat]: ' +
          util.encodeJsonData(data));
    }
  });
};
