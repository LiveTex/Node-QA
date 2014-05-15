qa = require('../bin');
async = require('node-async');

function complete(data) {
  console.log(data);
}

var browser = new qa.ext.ui.Browser('localhost', 4444);

var fnc = function() {

  var temp = new async.script.Value();

  return async.script.sequence([
    browser.createSession(qa.ext.ui.BrowserName.CHROME, qa.ext.ui.Platform.LINUX),
    async.console.log('create session'),
    browser.setUrl('http://yandex.ru'),
    async.console.log('setUrl'),
    browser.setTimeout('implicit', 200),
    async.console.log('setTimeout'),
    browser.findElement('id', 'tab-maps'),
    async.console.log('findElement'),
    browser.produceElementAction('click'),
    async.console.log('produceElementAction'),
    browser.findElement('id', 'text'),
    async.console.log('findElement'),
    temp.assign(),
    browser.produceElementAction('value', 'Saint-Petersburg Savushkina'),
    async.console.log('set value'),
    browser.produceElementAction('submit'),
    async.console.log('produce submit'),
    browser.getElementData('text'),
    async.console.log('text'),
    temp,
    browser.getElementData('name'),
    async.console.log('name'),
    temp,
    browser.getElementData('selected'),
    async.console.log('selected'),
    temp,
    browser.getElementData('enabled'),
    async.console.log('enabled'),
    temp,
    browser.getElementData('attribute', 'maxlength'),
    async.console.log('attribute:maxlength'),
    temp,
    browser.getElementData('displayed'),
    async.console.log('displayed'),
    temp,
    browser.getElementData('location'),
    async.console.expand('location'),
    browser.destroySession()
    //async.console.log(),
  ]);
};

fnc().call(null, null, complete, complete);








