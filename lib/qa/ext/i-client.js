


/**
 * @interface
 * @extends {events.IEventEmitter}
 *
 * @event destroy
 */
qa.ext.IClient = function() {};


/**
 * @param {boolean=} opt_force Флаг обязательного распростанения события.
 */
qa.ext.IClient.prototype.destroy = function(opt_force) {};
