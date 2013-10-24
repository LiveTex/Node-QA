


/**
 * @constructor
 * @param {string} session Request type.
 * @param {Object} body Request body.
 */
qa.business.comm.AuthIoServerRequest = function(session, body) {
  qa.business.Request.call(this, 'auth', null,
      '/handshake/' + Date.now().toString() +
      '?' + util.encodeFormData(util.encodeJsonData({
        'request': 'auth',
        'session': session,
        'source': 'entity',
        'body': body
      })));
};

util.inherits(qa.business.comm.AuthIoServerRequest, qa.business.comm.Message);


/**
 * @param {qa.business.entity.Visitor} visitor
 * @return {Object}
 */
qa.business.comm.authBody = function(visitor) {
  return {
    site: visitor.getSite(),
    referrer: '',
    page_title: '',
    page_url: '',
    seo_engine: '',
    seo_query: '',
    seo_referrer: '',
    is_mobile: false
  };
};
