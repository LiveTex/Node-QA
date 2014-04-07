

/**
 * @param {!string} path
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.ui.cutURL = function(path) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} data Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function cut(data, complete, cancel)
  {
    var temp = this.get(tokens);
    var elements = temp.split('/');
    elements.pop();
    temp = elements.join('/');
    this.set(tokens, temp);
    complete(data);
  }
  return cut;
};


/**
 * Шаг проверяющий статус сервера
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.ui.isServerOk = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/status/request';
  var responsePath = '/selenium/status/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'GET'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/status'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy('/selenium-conf/params/port', portPath)
        ])
    ),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.util.decodeJson,
    qa.state.save(responsePath + '/payload'),
    qa.ext.net.destroyClient('selenium'),
    qa.state.assert.equalsTo(responsePath + '/payload/status',
        0, 'Server state')
  ]);
};


/**
 * Шаг запрашивающий все сессии на сервере и передающий их
 * в следующий шаг в виде массива
 * @return {!async.Sequence} Созданный шаг.
 */
qa.ext.ui.getSessions = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/sessions/request';
  var responsePath = '/selenium/sessions/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'GET'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/sessions'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy('/selenium-conf/params/port', portPath)
        ])
    ),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.util.decodeJson,
    qa.ext.net.destroyClient('selenium'),
    qa.state.useInput(
        async.script.sequence([
          qa.state.load('value'),
          qa.state.useInput(
              qa.state.fold(async.script.sequence([
                qa.state.load('id')
              ]))
          )
        ])
    )
  ]);
};


/**
 * Шаг создающий сессию и возвращающий её ID в следующий шаг
 *
 * @param {string=} opt_browserConfigPath Путь к настройкам адреса селениума
 * @return {!async.Sequence} Созданный шаг.
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

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'POST'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session'),

    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        qa.state.copy(configPath + '/host', hostnamePath)
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        qa.state.copy(configPath + '/port', portPath)
    ),
    async.script.if(
        qa.state.condition.equalsTo(payloadPath +
        '/desiredCapabilities', null),
        qa.state.copy(browserConfigPath, payloadPath)
    ),
    qa.ext.net.createClient('selenium'),
    qa.state.load(payloadPath),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.util.decodeJson,
    qa.ext.net.destroyClient('selenium'),
    qa.state.useInput(
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
 * Шаг получает ID сессии из предыдущего и закрывает эту сессию.
 * @return {!async.Sequence} Созданный шаг.
 */
qa.ext.ui.deleteSession = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/delete-session/request';
  var responsePath = '/selenium/delete-session/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.setup(requestPath + '/params/method', 'DELETE'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.state.useInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.load(requestPath + '/params/path'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.state.setup(requestPath + '/params/path', '/wd/hub/session/'),
    qa.ext.net.destroyClient('selenium')
  ]);
};


/**
 *
 * Устанавливаем URL в сессии, ID которой передано из
 * предыдущего шага
 * @param {!string} URL URL для перехода
 * @return {!async.Sequence} Созданный шаг.
 */
qa.ext.ui.setURL = function(URL) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/set-url/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.useInput(
        async.script.sequence([
          qa.state.appendString(requestPath + '/params/path', '/'),
          qa.state.append(requestPath + '/params/path')
        ])
    ),
    qa.state.load('/selenium/messages/easy-post'),
    qa.state.appendString(requestPath + '/params/path', '/url'),
    qa.state.load(requestPath + '/params/path'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    qa.state.load('/selenium/messages/easy-post'),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.load('/selenium/messages/easy-post'),
    qa.state.setup(requestPath + '/payload/url', URL),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'URL changed'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.net.destroyClient('selenium')
  ]);
};


/**
 * Ищет DOM элемент.Возвращает в шаг "ID" элемента, справедливый
 * только для конкретной сессии и страницы.
 *
 * @param {!string} using Метод поиска
 * @param {!string} value Значения для поиска
 * @return {!async.Sequence}
 */
qa.ext.ui.locateElement = function(using, value) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/locate-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.appendString(requestPath + '/params/path', '/element'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.setup(requestPath + '/payload/using', using),
    qa.state.setup(requestPath + '/payload/value', value),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.util.decodeJson,
    qa.state.save(responsePath + '/payload'),

    async.script.if(
        qa.state.condition.equalsTo(responsePath + '/payload/status', 7),
        qa.state.setup('/selenium/latest-element', -1),
        qa.state.copy(responsePath + '/payload/value/ELEMENT',
            '/selenium/latest-element')
    ),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.net.destroyClient('selenium'),
    qa.state.load('/selenium/latest-element')
  ]);
};


/**
 * Нажать мышью на элемент, "ID" которого пришел в шаг
 *
 * @return {!async.Sequence}
 */
qa.ext.ui.clickElement = function() {

  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/click-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.appendString(requestPath + '/params/path', '/element/'),
    qa.state.useInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/click'),
    qa.state.load(requestPath + '/params/path'),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.state.load(responsePath + '/status'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Element Clicked'),
    //qa.state.load(requestPath + '/params/path'),
    qa.ext.net.destroyClient('selenium')
  ]);
};


/**
 *
 * Добавить к имеющемуся value элемента значение переданное в аргументе
 * ID элемента получается из предыдущего шага.
 * Справедливо только для элементов имеющих свойство value
 * @param {!string} text
 * @return {!async.Sequence}
 */
qa.ext.ui.addValue = function(text) {

  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/click-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var value = text;

  return async.script.sequence([
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.appendString(requestPath + '/params/path', '/element/'),
    qa.state.useInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/value'),
    qa.state.setup(requestPath + '/payload', '{value:[' + value + ']}'),
    qa.state.load(requestPath + '/params/path'),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.state.remove(requestPath + '/payload'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Value added'),
    qa.ext.net.destroyClient('selenium')
  ]);
};


/**
 * Выполняет submit для элемента, ID которого переданно из
 * предыдущего шага.
 * @return {!async.Sequence}
 */
qa.ext.ui.submitElement = function() {

  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/click-element/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([

    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.appendString(requestPath + '/params/path', '/element/'),
    qa.state.useInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/submit'),
    qa.state.load(requestPath + '/params/path'),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Element submited'),
    qa.ext.net.destroyClient('selenium')
  ]);
};


/**
 * Шаг осуществляет выбор фрейма по внутреннему ID
 * @param {!number} value
 * @return {!async.Sequence}
 */
qa.ext.ui.selectFrame = function(value) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/select-frame/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.appendString(requestPath + '/params/path', '/frame'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.setup(requestPath + '/payload/id', value),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    //qa.util.debug.log,
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Frame selected'),
    qa.ext.net.destroyClient('selenium'),
    qa.ext.ui.cutURL(requestPath + '/params/path')
  ]);

};


/**
 *  Установка таймаута для селениумовского поиска
 *  см. http://goo.gl/A7GX90
 * @param {!number} timeout
 * @return {!async.Sequence}
 */
qa.ext.ui.setImplicitTimeouts = function(timeout) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/select-frame/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([

    qa.state.appendString(requestPath + '/params/path',
        '/timeouts/implicit_wait'),
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/host', hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    qa.state.setup(requestPath + '/payload/ms', timeout),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    //qa.util.debug.log,
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Timeout set'),
    qa.ext.net.destroyClient('selenium'),
    qa.ext.ui.cutURL(requestPath + '/params/path'),
    qa.ext.ui.cutURL(requestPath + '/params/path')
  ]);

};