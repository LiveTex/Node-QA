qa = require('../bin');
async = require('node-async');

function complete(data){
  console.log(data);
}
var browser = new qa.ext.ui.Browser('localhost', 4444);


var steps = async.script.sequence([
  browser.createSession('chrome'),
  async.console.log(),
  browser.setUrl('http://yandex.ru'),
  async.console.log(),
  browser.setTimeout('implicit', 200),
  async.console.log(),
  browser.findElement('id', 'tab-maps'),
  async.console.log(),
  browser.produceElementAction('click'),
  async.console.log(),
  browser.findElement('id', 'text'),
  async.console.log(),
  browser.produceElementAction('value', 'Saint-Petersburg Savushkina'),
  browser.produceElementAction('submit'),
  //async.console.log(),
  //browser.destroySession(),
  //async.console.log(),
]);
steps.call(null, null, complete, complete);








