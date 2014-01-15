


/**
 * @constructor
 * @param {string} rawCookie Строка сырых Cookie.
 */
qa.ext.net.cookie.Cookie = function(rawCookie) {

  /**
   * @type {string}
   */
  this.__name = '';

  /**
   * @type {string}
   */
  this.__value = '';

  /**
   * @type {string} Доменное имя.
   */
  this.__domain = '';

  /**
   * @type {string} Путь.
   */
  this.__path = '';

  /**
   * @type {boolean} Только HTTP.
   */
  this.__httpOnly = false;

  /**
   * @type {boolean} Защищенные.
   */
  this.__secure = false;

  this.__populate(rawCookie);
};


/**
 * @return {string} Сериальзованный заголовок Cookie.
 */
qa.ext.net.cookie.Cookie.prototype.serialize = function() {
  var pairs = [this.__name + '=' + this.__value,
    'Domain=' + this.__domain, 'Path=' + this.__path];

  if (this.__httpOnly) {
    pairs.push('HttpOnly');
  }

  if (this.__secure) {
    pairs.push('Secure');
  }

  return pairs.join('; ');
};


/**
 * @param {string} rawCookie Строка сырых Cookie.
 */
qa.ext.net.cookie.Cookie.prototype.__populate = function(rawCookie) {
  var pairs = rawCookie.split(/; */);
  var options = {};

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var equalIndex = pair.indexOf('=');

    if (equalIndex < 0) {
      pair = pair.toUpperCase();
      if ('SECURE' === pair) {
        this.__secure = true;
      } else if ('HTTPONLY' === pair) {
        this.__httpOnly = true;
      }
      return;
    }

    var key = pair.substr(0, equalIndex).trim();
    var val = pair.substr(++equalIndex, pair.length).trim();

    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    if (options[key] == undefined) {
      switch (key.toUpperCase()) {
        case 'PATH':
          this.__path = val;
          break;
        case 'DOMAIN':
          this.__domain = val;
          break;
        default:
          this.__name = key;
          this.__value = val;
          break;
      }
    }
  }
};


/**
 * @return {string} Доменное имя.
 */
qa.ext.net.cookie.Cookie.prototype.getDomain = function() {
  return this.__domain;
};


/**
 * @return {string} Имя Cookie.
 */
qa.ext.net.cookie.Cookie.prototype.getName = function() {
  return this.__name;
};
