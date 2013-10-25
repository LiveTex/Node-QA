var IO_SERVER = 'io1-testhttp.livetex.ru';

var qa = require('../bin/index.js');
var async = require('node-async');

var app = new qa.business.app.Application();
var visitor = new qa.business.entity.Visitor('account:1914:site:10001350');
visitor.setIoAuthConnection('io');
visitor.setPollingConnection('poll');

var io_connection =
    new qa.business.comm.IoServerConnection(visitor, IO_SERVER);
app.attachConnection(visitor.getIoAuthConnection(), io_connection);

var polling_connection =
    new qa.business.comm.PollingServerConnection(IO_SERVER);
app.attachConnection(visitor.getPollingConnection(), polling_connection);

async.sequence([
  qa.business.app.web.auth,
  function(data, complete) {
    setTimeout(complete, 30000);
  }
]).call(app, visitor, function(data) {
  console.log(data);
},
console.log);
