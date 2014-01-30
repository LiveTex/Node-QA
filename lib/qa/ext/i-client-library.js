


/**
 * @interface
 */
qa.ext.IClientLibrary = function() {};


/**
 * @param {qa.ext.ClientName} name Выбранное имя.
 * @param {!qa.ext.IClient} client Соответсвующий клиент.
 */
qa.ext.IClientLibrary.prototype.registerClient = function(name, client) {};


/**
 * @param {qa.ext.ClientName} name Выбранное имя.
 * @return {qa.ext.IClient} Соответсвующий клиент.
 */
qa.ext.IClientLibrary.prototype.getClient = function(name) {};


/**
 * @param {qa.ext.ClientName} name Выбранное имя.
 */
qa.ext.IClientLibrary.prototype.terminateClient = function(name) {};


/**
 *
 */
qa.ext.IClientLibrary.prototype.terminateAllClients = function() {};
