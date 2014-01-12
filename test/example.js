
var async = require('node-async');
var qa = require('../bin');






/**
 * @type {!Object.<string, !async.Actor>}
 */
exec.test[qa.APP_CASE_PREFIX + '2221'] = {
  'app-1': qa.assert.success(async.script.sequence([
    qa.assert.equals('1111', 'Input ok.'),
    qa.state.save('../value'),
    qa.state.load('../value', 'string'),
    qa.state.load('/value', 'string'),

  ]), 'Case complete.'),

  'app-2': qa.assert.success(async.script.sequence([
    qa.assert.equals('22222', 'Input ok.')
  ]), 'Case complete.')
};



/**
 * @type {!Object.<string, !async.Actor>}
 */
exec.test[qa.APP_INPUT_PREFIX + '2221'] = async.insert(['1111', '22222']);

