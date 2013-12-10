


/**
 * @interface
 */
qa.test.IContextFactory = function() {};


/**
 * @param {string} name Имя.
 * @param {*} data Данные.
 * @param {function(!qa.test.IContext)} complete Обработчик завершения.
 * @param {function(string, number=)} cancel Обрабтчик ошибки.
 */
qa.test.IContextFactory.prototype.createContext =
    function(name, data, complete, cancel) {};