var IO_SERVER = 'io3-testhttp.livetex.ru';

var qa = require('../bin/index.js');
var async = require('node-async');

var app = new qa.business.app.Application();
var visitor = new qa.business.entity.Visitor('account:1914:site:10001350');
visitor.setIoAuthChannel('io');
visitor.setPollingChannel('poll');

var io_connection =
    new qa.business.comm.IoServerConnection(IO_SERVER);
app.attachConnection(visitor.getIoAuthChannel(), io_connection);

var polling_connection =
    new qa.business.comm.PollingServerConnection(IO_SERVER);
app.attachConnection(visitor.getPollingChannel(), polling_connection);

async.sequence([
  qa.business.app.web.auth,
  qa.business.app.web.startPolling
]).call(app, visitor, function(data) {
  console.log(data);
},
console.log);
