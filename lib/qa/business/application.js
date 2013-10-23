


/**
 * @constructor
 */
qa.business.Application = function() {

  /**
   * @type {!ds.queue.Queue}
   */
  this.__channels = new ds.queue.Queue();
};


/**
 * @param {string} name Channel name.
 * @param {qa.business.IConnection} channel Channel.
 */
qa.business.Application.prototype.attachChannel = function(name, channel) {
  this.__channels[name] = channel;
};


/**
 * @param {string} name Channel name.
 * @return {qa.business.IConnection} Channel.
 */
qa.business.Application.prototype.getChannelByName = function(name) {
  return this.__channels[name] || null;
};


/**
 * @param {string} name Channel name.
 */
qa.business.Application.prototype.detachChannel = function(name) {
  delete this.__channels[name];
};
