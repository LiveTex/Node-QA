


/**
 * @constructor
 * @param {!qa.business.entity.Visitor|!qa.business.entity.Member} user
 * @param {!async.TaskFunction} scenario
 * @param {qa.business.io.MemberSession|
 *   qa.business.io.VisitorSession=} opt_session
 */
qa.business.entity.Client = function(user, scenario, opt_session) {

  /**
   * @type {!qa.business.entity.Visitor|!qa.business.entity.Member}
   */
  this.__user = user;

  /**
   * @type {!async.TaskFunction}
   */
  this.__scenario = scenario;

  /**
   * @type {qa.business.io.MemberSession|
   *   qa.business.io.VisitorSession|undefined} opt_session
   */
  this.__session = (typeof opt_session === 'undefined') ? null : opt_session;

};


/**
 * @return {!qa.business.entity.Visitor|!qa.business.entity.Member}
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
 * @return {qa.business.io.MemberSession|
 *   qa.business.io.VisitorSession|undefined} opt_session
 */
qa.business.entity.Client.prototype.getSession = function() {
  return this.__session;
};

