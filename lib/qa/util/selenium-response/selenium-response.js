


/**
 * @param {string} data
 * @extends {util.obj.SafeObject}
 * @constructor
 */
qa.util.SeleniumResponse = function(data) {
  util.obj.SafeObject.call(this, Object(util.decodeJson(data)));
};

util.inherits(qa.util.SeleniumResponse, util.obj.SafeObject);


/**
 * @return {!boolean}
 */
qa.util.SeleniumResponse.prototype.isOk = function() {
  var self = this;
  return (self.get('status') === 0);
};


/**
 * @return {?string}
 */
qa.util.SeleniumResponse.prototype.getState = function() {
  var self = this;
  if (typeof self.get('state') === 'string') {
    return (String(self.get('state')));
  } else {
    return null;
  }
};


/**
 * @return {string}
 */
qa.util.SeleniumResponse.prototype.getSessionId = function() {
  var self = this;
  if (typeof self.get('sessionId') === 'string') {
    return (String(self.get('sessionId')));
  } else {
    return '';
  }
};


/**
 * @return {?number}
 */
qa.util.SeleniumResponse.prototype.getStatus = function() {
  var self = this;
  if (typeof self.get('status') === 'number') {
    return (Number(self.get('status')));
  } else {
    return null;
  }
};


/**
 * @return {util.obj.SafeObject||*}
 */
qa.util.SeleniumResponse.prototype.getValue = function() {
  var self = this;
  if (typeof self.get('value') === 'object')
  {
    return new util.obj.SafeObject(Object(self.get('value')));
  } else {
    return self.get('value');
  }
};
