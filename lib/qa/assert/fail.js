


/**
 * @constructor
 * @extends {qa.state.Cursor}
 * @implements {qa.ext.IClientLibrary}
 * @implements {qa.result.folder.IFolder}
 *
 * @param {!qa.state.Cursor} cursor Курсор.
 */
qa.assert.Fail = function(cursor) {
  qa.state.Cursor.call(this,
      cursor.getCore(), cursor.getPath(), cursor, cursor);
};

util.inherits(qa.assert.Fail, qa.state.Cursor);


/**
 * @inheritDoc
 */
qa.assert.Fail.prototype.copy = function(path) {
  return new qa.assert.Fail(
      qa.state.Cursor.prototype.copy.call(this, path));
};


/**
 * @inheritDoc
 */
qa.assert.Fail.prototype.addResult = function(result, tags) {
  if (result.get()) {
    qa.state.Cursor.prototype.addResult.call(this, result, tags);
  }
};
