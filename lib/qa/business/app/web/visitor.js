

/**
 * @this {!qa.business.app.Application}
 * @param {!qa.business.entity.IVisitorHolder} data
 * @param {!async.TaskFunction} complete
 * @param {!async.TaskFunction} cancel
 */
qa.business.app.web.auth = function(data, complete, cancel) {
  var visitor = data.getVisitor();
  this.getConnectionByName(visitor.getIoAuthChannel()).request(
      qa.business.comm.AuthIoServerRequest(
          qa.business.comm.authBodyFromVisitor(visitor)),
      complete,
      cancel
  );
};
