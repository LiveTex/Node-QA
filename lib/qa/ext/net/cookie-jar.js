


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
