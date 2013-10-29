

/**
 * @param {string} id Full visitor id (chat-server or not).
 * @return {qa.business.entity.Visitor} Visitor.
 */
qa.business.entity.factory.createVisitorFromId = function(id) {
  var decodedId = qa.business.utils.decodeChatServerVisitorId(id);
  var ids = qa.business.utils.getIdsByEntityName(decodedId);
  if (typeof ids['account'] === 'string' &&
      typeof ids['site'] === 'string' &&
      typeof ids['visitor'] === 'string') {
    var visitor = new qa.business.entity.Visitor('account:' + ids['account'] +
        ':site:' + ids['site']);

    return visitor;
  }
  return null;
};
