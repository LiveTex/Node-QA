

/**
 * @this {qa.business.app.Application}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.web.auth = function(holder, complete, cancel) {
  var self = this;
  var visitor = holder.getVisitor();

  function localComplete(response) {
    var channel = self.getConnectionByName(visitor.getPollingConnection());
    visitor.setPollingConnection(response.getPoll());
    channel.setPoll(response.getPoll());
    self.attachConnection(visitor.getPollingConnection(), channel);
    visitor.setSession(response.getSession());
    complete(holder);
  }

  this.getConnectionByName(visitor.getIoAuthConnection()).request(
      new qa.business.comm.AuthIoServerRequest(
          qa.business.comm.authBodyFromVisitor(visitor)),
      localComplete,
      cancel
  );
};


/**
 * @this {qa.business.app.Application}
 * @param {!qa.business.entity.IVisitorHolder} holder Visitor holder.
 * @param {function(!qa.business.entity.IVisitorHolder)} complete
 *   Success handler.
 * @param {function(string, number=)} cancel Error handler.
 */
qa.business.app.web.startPolling = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  console.log(visitor.getPollingConnection());
  console.log(this.getConnectionByName(visitor.getPollingConnection()));
  this.getConnectionByName(visitor.getPollingConnection()).connect();
  complete(holder);
};
