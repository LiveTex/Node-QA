


/**
 * Фабрика накопителей результата.
 *
 * @interface
 */
qa.result.IFolderFactory = function() {};


/**
 * Создание накопителя по имени.
 *
 * @param {string} name Имя накопителя.
 * @return {!qa.result.IFolder} Созданный накопитель.
 */
qa.result.IFolderFactory.prototype.createFolder = function(name) {};
