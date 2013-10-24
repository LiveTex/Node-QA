

/**
 * @param {string} host Chat server address/name.
 * @param {number=} opt_port Chat server port.
 * @return {!ts.Slave} Chat server slave.
 */
qa.business.comm.getChatServerSlave = function(host, opt_port) {
  var port = opt_port || 1278;
  var slave = new ts.Slave(port, host);
  slave.addListener('error', console.error);
  slave.connect(port, host);

  return slave;
};
