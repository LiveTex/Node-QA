


/**
 * @constructor
 */
qa.ext.net.cookie.CookieJar = function() {

  /**
   * @type {!Object.<string, !qa.ext.net.cookie.Cookie>} Хранилище cookies.
   */
  this.__storage = {};
};


/**
 * Возвращает значение Cookie по имени.
 * @param {string} name
 * @return {!qa.ext.net.cookie.Cookie} Cookie с опциями.
 */
qa.ext.net.cookie.CookieJar.prototype.getByName = function(name) {
  return this.__storage[name];
};


/**
 * @param {!qa.ext.net.cookie.Cookie} value Cookie с опциями.
 */
qa.ext.net.cookie.CookieJar.prototype.set = function(value) {
  this.__storage[value.getName()] = value;
};


/**
 * @param {string} domain Доменное имя.
 * @return {!Array.<!qa.ext.net.cookie.Cookie>} список Cookie.
 */
qa.ext.net.cookie.CookieJar.prototype.getByDomain = function(domain) {
  var results = [];
  for (var name in this.__storage) {
    if (this.__storage.hasOwnProperty(name)) {
      if (typeof this.__storage[name].getDomain() === 'string') {
        if (domain.indexOf(this.__storage[name].getDomain()) >= 0) {
          results.push(this.__storage[name]);
        }
      }
    }
  }

  return results;
};
