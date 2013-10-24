

/**
 * @this {qa.business.app.Application}
 * @param {!qa.business.entity.IVisitorHolder} holder
 * @param {!async.TaskFunction} complete
 * @param {!async.TaskFunction} cancel
 */
qa.business.app.web.auth = function(holder, complete, cancel) {
  var self = this;
  var visitor = holder.getVisitor();

  function localComplete(response) {
    var channel = self.getConnectionByName(visitor.getPollingChannel());
    visitor.setPollingChannel(response.getPoll());
    channel.setPoll(response.getPoll());
    self.attachConnection(visitor.getPollingChannel(), channel);
    visitor.setSession(response.getSession());
    complete(holder);
  }

  this.getConnectionByName(visitor.getIoAuthChannel()).request(
      new qa.business.comm.AuthIoServerRequest(
          qa.business.comm.authBodyFromVisitor(visitor)),
      localComplete,
      cancel
  );
};


/**
 * @this {qa.business.app.Application}
 * @param {!qa.business.entity.IVisitorHolder} holder
 * @param {!async.TaskFunction} complete
 * @param {!async.TaskFunction} cancel
 */
qa.business.app.web.startPolling = function(holder, complete, cancel) {
  var visitor = holder.getVisitor();
  console.log(visitor.getPollingChannel());
  console.log(this.getConnectionByName(visitor.getPollingChannel()));
  this.getConnectionByName(visitor.getPollingChannel()).connect();
  complete(holder);
};
