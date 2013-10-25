

var qa = require('../bin/index.js');
var async = require('node-async');


console.info('setUp is called');
var app = new qa.business.app.Application();
app.setLivetexIoHost('http://io1-testhttp.livetex.ru');

var visitor = new qa.business.entity.Visitor('account:1914:site:10001350');
async.sequence([
  qa.business.app.web.auth
]).call(app, visitor, function(data) {
  console.log('data:', data);
}, console.error);
