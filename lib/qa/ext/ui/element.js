


/**
 * @param {qa.ext.ui.Browser} browser
 * @param {string=} opt_id
 * @constructor
 */
qa.ext.ui.Element = function(browser, opt_id) {

  /**
   * @type {?string}
   */
  this.__id = opt_id || null;

  /**
   * @type {qa.ext.ui.Browser}
   */
  this.__browser = browser;

};


/**
 * @return {?string}
 */
qa.ext.ui.Element.prototype.getId = function() {
  return this.__id;
};


/**
 * @param {!async.Step=} opt_step
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.assign = function(opt_step) {
  var self = this;
  /**
   * @this {!async.Context}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  function set(input, complete, cancel) {
    if (typeof input === 'string') {
      self.__id = input;
    }
    complete(input);
  }
  if (opt_step === undefined) {
    return set;
  } else {
    return async.script.sequence([
      opt_step,
      set
    ]);
  }
};


/**
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.__getIdStep = function() {
  var self = this;
  /**
   * @this {!async.Context}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчи ошибки.
   */
  return function(input, complete, cancel) {
    complete(self.__id);
  };
};


/**
 * @return {?qa.ext.ui.Browser}
 */
qa.ext.ui.Element.prototype.getBrowser = function() {
  return this.__browser;
};


/**
 * @param {!qa.ext.ui.SearchStrategy} strategy Search strategy.
 * @param {string} query Search query.
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.find = function(strategy, query) {
  return this.assign(this.__browser.findElement(strategy, query));
};


/**
 * @param {!qa.ext.ui.SearchStrategy} strategy Search strategy.
 * @param {string} query Search query.
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.findFrom = function(strategy, query) {
  var element = new qa.ext.ui.Element(this.__browser);
  return element.assign(this.__browser.findElement(strategy, query, this));
};


/**
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.click = function() {
  return async.script.sequence([
    this.__getIdStep(),
    this.__browser.produceElementAction(qa.ext.ui.ActionMethod.CLICK)
  ]);
};


/**
 * @param {string} value
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.value = function(value) {
  return async.script.sequence([
    this.__getIdStep(),
    this.__browser.produceElementAction(qa.ext.ui.ActionMethod.VALUE, value)
  ]);
};


/**
 * @param {string} attribute
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.attribute = function(attribute) {
  return async.script.sequence([
    this.__getIdStep(),
    this.__browser.getElementData(qa.ext.ui.ElementProperty.ATTRIBUTE,
        attribute)
  ]);
};


/**
 * @return {!async.Step}
 */
qa.ext.ui.Element.prototype.text = function() {
  return async.script.sequence([
    this.__getIdStep(),
    this.__browser.getElementData(qa.ext.ui.ElementProperty.TEXT)
  ]);
};


/**
 * @param {async.Context} context Контекст вызова
 * @param {async.Input} input Входные данные.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.ext.ui.Element.prototype.call = function(context, input, complete, cancel) {
  complete(this);
};
