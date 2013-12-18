
var async = require('node-async');
var qa = require('../bin');





var node = new qa.db.Node({});


var path = new qa.db.Path('/path/to/value');
var path2 = new qa.db.Path('/path/to');
var path3 = new qa.db.Path('/path/to/value/..');

path.set(node, '1');
console.log(node.__value, path3.get(node));

path2.set(node, '1');
console.log(node.__value, path3.get(node));

