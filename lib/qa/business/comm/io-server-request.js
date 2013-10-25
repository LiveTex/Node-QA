


/**
 * @constructor
 * @extends {qa.business.comm.Message}
 * @param {!Object} body Request body.
 * @param {string=} opt_session Request type.
 */
qa.business.comm.AuthIoServerRequest = function(body, opt_session) {
  opt_session = opt_session || '';
  qa.business.comm.Message.call(this, 'auth',
      '/handshake/' + Date.now().toString() +
      '?' + util.encodeFormData({
        'hold_timeout': 0,
        'destroy_timeout': 40000,
        'hold_for_auth': true,
        'first_data': util.encodeJsonData({
          'request': 'auth',
          'session': opt_session,
          'source': 'visitor',
          'body': body
        })
      }));
};

util.inherits(qa.business.comm.AuthIoServerRequest, qa.business.comm.Message);


/**
 * @param {!qa.business.entity.Visitor} visitor Visitor object.
 * @return {!Object} Visitor auth data.
 */
qa.business.comm.authBodyFromVisitor = function(visitor) {
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
