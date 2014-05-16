qa = require('../bin');
async = require('node-async');

function complete(data) {
  console.log(data);
}

var browser = new qa.ext.ui.Browser('localhost', 4444);

var fnc = function() {

  var temp = new async.script.Value();

  return async.script.sequence([
    browser.createSession(qa.ext.ui.BrowserName.CHROME,
        qa.ext.ui.Platform.LINUX),
    async.console.log('create session'),
    browser.setUrl('http://yandex.ru'),
    async.console.log('setUrl'),
    browser.setTimeout(qa.ext.ui.Timeout.IMPLICIT, 500),
    async.console.log('setTimeout'),
    browser.findElement(qa.ext.ui.SearchStrategy.ID, 'tab-maps'),
    async.console.log('findElement'),
    browser.produceElementAction(qa.ext.ui.ActionMethod.CLICK),
    async.console.log('produceElementAction'),
    browser.findElement(qa.ext.ui.SearchStrategy.ID, 'text'),
    async.console.log('findElement'),
    temp.assign(),
    browser.produceElementAction(qa.ext.ui.ActionMethod.VALUE,
        'Saint-Petersburg Savushkina'),
    async.console.log('set value'),
    browser.produceElementAction(qa.ext.ui.ActionMethod.SUBMIT),
    async.console.log('produce submit'),
    browser.getElementData(qa.ext.ui.Element.TEXT),
    async.console.log('text'),
    temp,
    browser.getElementData(qa.ext.ui.Element.NAME),
    async.console.log('name'),
    temp,
    browser.getElementData(qa.ext.ui.Element.SELECTED),
    async.console.log('selected'),
    temp,
    browser.getElementData(qa.ext.ui.Element.ENABLED),
    async.console.log('enabled'),
    temp,
    browser.getElementData(qa.ext.ui.Element.ATTRIBUTE, 'maxlength'),
    async.console.log('attribute:maxlength'),
    temp,
    browser.getElementData(qa.ext.ui.Element.DISPLAYED),
    async.console.log('displayed'),
    temp,
    browser.getElementData(qa.ext.ui.Element.LOCATION),
    async.console.expand('location'),
    browser.destroySession()
    //async.console.log(),
  ]);
};

fnc().call(null, null, complete, complete);








