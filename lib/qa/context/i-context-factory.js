


/**
 * @interface
 */
qa.context.IContextFactory = function() {};


/**
 * @param {string} name Цель создания приложения.
 * @param {*} target Цель создания приложения.
 * @param {function(!qa.context.ITestContext)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.context.IContextFactory.prototype.createContext =
    function(name, target, complete, cancel) {};

