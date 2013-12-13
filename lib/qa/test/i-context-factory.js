


/**
 * @interface
 */
qa.test.IContextFactory = function() {};


/**
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя.
 * @param {!qa.db.Node} node Имя.
 * @param {*} data Данные.
 * @param {function(!qa.test.IContext)} complete Обработчик завершения.
 * @param {function(string, number=)} cancel Обрабтчик ошибки.
 */
qa.test.IContextFactory.prototype.createContext =
    function(name, log, node, data, complete, cancel) {};