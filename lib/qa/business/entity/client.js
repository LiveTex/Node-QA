


/**
 * @constructor
 * @param {!qa.business.entity.User} user
 * @param {!async.TaskFunction} scenario
 * @param {qa.business.app.Session=} opt_session
 */
qa.business.entity.Client = function(user, scenario, opt_session) {

  /**
   * @type {!qa.business.entity.User}
   */
  this.__user = user;

  /**
   * @type {!async.TaskFunction}
   */
  this.__scenario = scenario;

  /**
   * @type {?qa.business.app.Session}
   */
  this.__session = (typeof opt_session === 'undefined') ? null : opt_session;

};


/**
 * @return {!qa.business.entity.User}
 */
qa.business.entity.Client.prototype.getUser = function() {
  return this.__user;
};


/**
 * @return {!async.TaskFunction}
 */
qa.business.entity.Client.prototype.getScenario = function() {
  return this.__scenario;
};


/**
 * @return {?qa.business.app.Session}
 */
qa.business.entity.Client.prototype.getSession = function() {
  return this.__session;
};

