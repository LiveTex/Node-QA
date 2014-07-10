


/**
 * @constructor
 */
qa.ext.net.CookieJar = function() {

  /**
   * @type {!Object.<string, !qa.ext.net.Cookie>} Хранилище cookies.
   */
  this.__storage = {};
};


/**
 * Возвращает значение Cookie по имени.
 * @param {string} name
 * @return {qa.ext.net.Cookie} Cookie с опциями.
 */
qa.ext.net.CookieJar.prototype.getByName = function(name) {
  return this.__storage[name];
};


/**
 * @param {!qa.ext.net.Cookie} value Cookie с опциями.
 */
qa.ext.net.CookieJar.prototype.set = function(value) {
  this.__storage[value.getName()] = value;
};


/**
 * @param {string} domain Доменное имя.
 * @return {!Array.<!qa.ext.net.Cookie>} список Cookie.
 */
qa.ext.net.CookieJar.prototype.getByDomain = function(domain) {
  var results = [];
  for (var name in this.__storage) {
    if (domain.indexOf(this.__storage[name].getDomain()) >= 0) {
      results.push(this.__storage[name]);
    }
  }

  return results;
};


/**
 *
 */
qa.ext.net.CookieJar.prototype.cleanup = function() {
  this.__storage = {};
};


/**
 * @param {!Object} options Опиции запроса.
 * @return {!Object} Опиции запроса расширенные заголовками Cookie.
 */
qa.ext.net.CookieJar.prototype.populateCookieHeaders = function(options) {
  if (options['hostname']) {
    var cookies = this.getByDomain(options['hostname']);
    var headers = {};
    var cookieHeader = [];

    if (options['headers'] instanceof Object) {
      headers = options['headers'];
    }

    if (typeof headers['Cookie'] === 'string') {
      cookieHeader = [headers['Cookie']];
    }

    for (var i = 0; i < cookies.length; i++) {
      cookieHeader.push(cookies[i].serialize());
    }

    options['headers'] = headers;
    headers['Cookie'] = cookieHeader;
  }

  return options;
};
