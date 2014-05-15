

/**
 * Шаг запрашивающий все сессии на сервере и передающий их
 * в следующий шаг в виде массива
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.ui.getSessions = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/sessions/request';
  var responsePath = '/selenium/sessions/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString().toString();

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'GET'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/sessions'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.util.decodeJson,
    qa.ext.net.destroyClient(clientId),
    qa.state.mapInput(
        async.script.sequence([
          qa.state.load('value'),
          qa.state.mapInput(
              qa.state.fold(
              qa.state.load('Id')
              )
          )
        ])
    )
  ]);
};


/**
 * Шаг создающий сессию и возвращающий её Id в следующий шаг
 *
 * @param {string=} opt_browserConfigPath Путь к настройкам адреса селениума
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.ui.createSession = function(opt_browserConfigPath) {
  var browserConfigPath = opt_browserConfigPath ||
      '/selenium/default-browser-config';
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/create-session/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var payloadPath = requestPath + '/payload';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'POST'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.copynx(browserConfigPath, payloadPath +
        '/desiredCapabilities'),
    qa.ext.net.createClient(clientId),
    qa.state.load(payloadPath),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.util.decodeJson,
    qa.ext.net.destroyClient(clientId),
    qa.state.mapInput(
        async.script.sequence([
          qa.state.assert.exists('sessionId', 'New session created'),
          qa.state.load('sessionId'),
          qa.state.save('/selenium/latest-session')
        ])
    ),
    qa.state.remove(payloadPath)
  ]);
};


/**
 * Шаг получает Id сессии из предыдущего и закрывает эту сессию.
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.ui.deleteSession = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/delete-session/request';
  var responsePath = '/selenium/delete-session/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'DELETE'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.mapInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.load(requestPath + '/params/path'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.ext.net.destroyClient(clientId)
  ]);
};


/**
 *
 * Устанавливаем URL в сессии, Id которой передано из
 * предыдущего шага
 * @param {!string} URL URL для перехода
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.ui.setURL = function(URL) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/set-url/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.mapInput(
        async.script.sequence([
          qa.state.appendString(requestPath + '/params/path', '/'),
          qa.state.append(requestPath + '/params/path')
        ])
    ),
    qa.state.appendString(requestPath + '/params/path', '/url'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.setup(requestPath + '/payload/url', URL),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'URL changed'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path'),
    qa.ext.net.destroyClient(clientId)
  ]);
};


/**
 * Ищет DOM элемент.Возвращает в шаг "Id" элемента, справедливый
 * только для конкретной сессии и страницы.
 *
 * @param {!string} using Метод поиска
 * @param {!string} value Значения для поиска
 * @return {!async.Step}
 */
qa.ext.ui.locateElement = function(using, value) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/locate-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.appendString(requestPath + '/params/path', '/element'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.setup(requestPath + '/payload/using', using),
    qa.state.setup(requestPath + '/payload/value', value),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.util.decodeJson,
    qa.state.save(responsePath + '/payload'),
    async.script.if(
        qa.state.condition.equalsTo(responsePath + '/payload/status', 7),
        qa.state.setup('/selenium/latest-element', -1),
        qa.state.copy(responsePath + '/payload/value/ELEMENT',
            '/selenium/latest-element')
    ),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path'),
    qa.ext.net.destroyClient(clientId),
    qa.state.load('/selenium/latest-element')
  ]);
};


/**
 * Нажать мышью на элемент, "Id" которого пришел в шаг
 *
 * @return {!async.Step}
 */
qa.ext.ui.clickElement = function() {

  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/click-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.appendString(requestPath + '/params/path', '/element/'),
    qa.state.mapInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/click'),
    qa.state.load(requestPath + '/params/path'),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path'),
    qa.state.load(responsePath + '/status'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Element Clicked'),
    //qa.state.load(requestPath + '/params/path'),
    qa.ext.net.destroyClient(clientId)
  ]);
};


/**
 *
 * Добавить к имеющемуся value элемента значение переданное в аргументе
 * Id элемента получается из предыдущего шага.
 * Справедливо только для элементов имеющих свойство value
 * @param {!string} text
 * @return {!async.Step}
 */
qa.ext.ui.addValue = function(text) {

  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/click-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.appendString(requestPath + '/params/path', '/element/'),
    qa.state.mapInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/value'),
    qa.state.setup(requestPath + '/payload', '{value:[' + text + ']}'),
    qa.state.load(requestPath + '/params/path'),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path'),
    qa.state.remove(requestPath + '/payload'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Value added'),
    qa.ext.net.destroyClient(clientId)
  ]);
};


/**
 * Выполняет submit для элемента, Id которого переданно из
 * предыдущего шага.
 * @return {!async.Step}
 */
qa.ext.ui.submitElement = function() {

  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/click-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.appendString(requestPath + '/params/path', '/element/'),
    qa.state.mapInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/submit'),
    qa.state.load(requestPath + '/params/path'),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Element submited'),
    qa.ext.net.destroyClient(clientId)
  ]);
};


/**
 * Шаг осуществляет выбор фрейма по внутреннему Id
 * @param {!number} value
 * @return {!async.Step}
 */
qa.ext.ui.selectFrame = function(value) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/select-frame/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.appendString(requestPath + '/params/path', '/frame'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.setup(requestPath + '/payload/Id', value),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Frame selected'),
    qa.ext.net.destroyClient(clientId),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path')
  ]);

};


/**
 *  Установка таймаута для селениумовского поиска
 *  см. http://goo.gl/A7GX90
 * @param {!number} timeout
 * @return {!async.Step}
 */
qa.ext.ui.setImplicitTimeouts = function(timeout) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/select-frame/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var clientId = Math.random().toString();

  return async.script.sequence([
    qa.state.appendString(requestPath + '/params/path',
        '/timeouts/implicit_wait'),
    qa.state.copynx(configPath + '/host', hostnamePath),
    qa.state.copynx(configPath + '/port', portPath),
    qa.state.setup(requestPath + '/payload/ms', timeout),
    qa.ext.net.createClient(clientId),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, clientId),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Timeout set'),
    qa.ext.net.destroyClient(clientId),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.load('/selenium/latest-session'),
    qa.state.append(requestPath + '/params/path')
  ]);

};
