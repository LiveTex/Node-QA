


/**
 * @interface
 */
qa.app.IApplicationFactory = function() {};


/**
 * @param {string} name Цель создания приложения.
 * @param {*} target Цель создания приложения.
 * @param {function(!qa.app.IApplication)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.app.IApplicationFactory.prototype.createApplication =
    function(name, target, complete, cancel) {};
