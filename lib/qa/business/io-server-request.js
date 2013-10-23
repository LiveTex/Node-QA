


/**
 * @constructor
 * @param {string} session Request type.
 * @param {Object} body Request body.
 */
qa.business.AuthIoServerRequest = function(session, body) {
  qa.business.Request.call(this, 'auth', null,
      '/handshake/' + Date.now().toString() +
      '?' + util.encodeFormData(util.encodeJsonData({
        'request': 'auth',
        'session': session,
        'source': 'visitor',
        'body': body
      })));
};

util.inherits(qa.business.AuthIoServerRequest, qa.business.Request);


/**
 * @param {qa.business.visitor.Visitor} visitor
 * @return {Object}
 */
qa.business.visitor.authBody = function(visitor) {
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
