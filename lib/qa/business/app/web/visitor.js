

/**
 * @param {!qa.business.entity.IVisitorHolder} data
 * @param {!async.TaskFunction} complete
 * @param {!async.TaskFunction} cancel
 * @this {!qa.Application}
 */
qa.business.app.web.auth = function(data, complete, cancel) {
  var auth = {
    hold_for_auth: true,
    first_data: util.encodeJsonData(
        qa.business.entity.authData(data.getVisitor()))
  };

  var parsed_response = qa.business.parseAuthResponse(chunk);
  data.getVisitor().setSession(parsed_response['packet']['session']);
  data.getVisitor().setPollingChannel(parsed_response['poll']);
};


/**
 * @param {!string} response
 * @return {{packet: !Object, poll: !string}}
 */
qa.business.app.web.parseAuthResponse = function(response) {
  var packet_start = response.search('{');
  return {
    packet: response.slice(packet_start),
    poll: response.slice(0, packet_start)
  };
};
