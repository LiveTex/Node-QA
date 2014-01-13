


/**
 * Интерфейс накопителя результатов теста.
 *
 * @see qa.result.IResult
 *
 * @interface
 */
qa.result.folder.IFolder = function() {};


/**
 * @param {string} name Выбранное имя.
 * @return {!qa.result.folder.IFolder} Дочерний накопитель.
 */
qa.result.folder.IFolder.prototype.createChild = function(name) {};


/**
 * Применение текущего состояния результата теста накопителем.
 *
 * @param {!qa.result.Tags} tags Метки реультата.
 */
qa.result.folder.IFolder.prototype.processState = function(tags) {};


/**
 * Добавление результата теста накопителем.
 *
 * Добавлению результата сопуствует упорядоченный набор меток результата,
 * необходимый для соотствующей обработчки накопителем.
 *
 * @param {!qa.result.IResult} result Результат теста.
 * @param {!qa.result.Tags} tags Метки реультата.
 */
qa.result.folder.IFolder.prototype.addResult = function(result, tags) {};


/**
 * Применение результата накопления.
 *
 * Результат накопления так же является результатом теста.
 *
 * @return {!qa.result.IResult} Резульатат накопления.
 */
qa.result.folder.IFolder.prototype.getResult = function() {};
