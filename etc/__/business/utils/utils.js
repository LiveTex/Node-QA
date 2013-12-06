

/**
 * Can be used on already decoded id.
 * @param {string} id Chat server encoded visitor id.
 * @return {string} Decoded full visitor id.
 */
qa.business.utils.decodeChatServerVisitorId = function(id) {
  return id.replace('a/', 'account:').replace('/s/', ':site:')
      .replace('/v/', ':visitor:');
};


/**
 * @param {string} entityName Id из редиса.
 * @return {!Object.<string, string>} Данные по id и предкам из ключа.
 */
qa.business.utils.getIdsByEntityName = function(entityName) {
  var objectIds = {};

  var arrayIds = entityName.split(':');
  var length = arrayIds.length - arrayIds.length % 2;
  for (var i = 0; i < length - 1; i += 2) {
    objectIds[arrayIds[i]] = arrayIds[i + 1];
  }

  return objectIds;
};
