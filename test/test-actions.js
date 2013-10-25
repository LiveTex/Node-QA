

var qa = require('../bin/index.js');
var async = require('node-async');


console.info('setUp is called');
var app = new qa.business.app.Application();
app.setLivetexIoHost('http://io3-evgen.livetex.ru')

var visitor = new qa.business.entity.Visitor('account:568:site:10000103');
async.sequence([
  qa.business.app.web.auth
]).call(app, visitor, function(data) {
  console.log('data:', data);
}, console.error);
