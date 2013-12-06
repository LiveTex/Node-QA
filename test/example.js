
var async = require('node-async');
var qa = require('../bin');

qa.case('hello-test', async.script.sequence([
  qa.assertEquals(1, 'Data is 1.')
])).call(null, 1, console.log, console.error);
