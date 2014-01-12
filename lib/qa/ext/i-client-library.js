


/**
 * @interface
 */
qa.ext.IClientLibrary = function() {};


/**
 * @param {qa.ext.ClientName} name Выбранное имя.
 * @param {!qa.ext.Client} client Соответсвующий клиент.
 */
qa.ext.IClientLibrary.prototype.registerClient = function(name, client) {};


/**
 * @param {qa.ext.ClientName} name Выбранное имя.
 * @return {qa.ext.Client} Соответсвующий клиент.
 */
qa.ext.IClientLibrary.prototype.getClient = function(name) {};


/**
 * @param {qa.ext.ClientName} name Выбранное имя.
 * @return {qa.ext.Client} Соответсвующий клиент.
 */
qa.ext.IClientLibrary.prototype.terminateClient = function(name) {};
