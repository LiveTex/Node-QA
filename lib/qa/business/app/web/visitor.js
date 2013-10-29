

/**
 * @this {qa.business.app.Application}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.web.auth = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();

  var self = this;
  var connection = new qa.business.io.LivetexServerConnection(visitor,
      this.getLivetexIoHost(), function(message) {
        var data = message.getData();
        if (data instanceof Object &&
            data['body'] instanceof Object &&
            typeof data['session'] === 'string') {
          visitor.setSession(data['session']);
          visitor.populate(data['body']);
          self.attachConnection(visitor.getLivetexServerName(), connection);
          complete(holder);
        } else {
          cancel('Wrong auth response: ' + data);
        }
      });
};
