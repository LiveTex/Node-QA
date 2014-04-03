

/**
 * Шаг проверяющий статус сервера
 * @return {!async.Step} Созданный шаг.
 */
qa.ext.selenium.isServerOk = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/status/request';
  var responsePath = '/selenium/status/response';
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
qa.ext.selenium.getSessions = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/sessions/request';
  var responsePath = '/selenium/sessions/response';
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
qa.ext.selenium.createSession = function(opt_browserConfigPath) {
  var browserConfigPath = opt_browserConfigPath ||
      '/selenium/defaul-browser-config';
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/create-session/request';
  var responsePath = '/selenium/create-session/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';
  var desiredCapabilitiesPath = requestPath + '/payload';

  return async.script.sequence([
    async.script.if(
        qa.state.condition.equalsTo(hostnamePath, null),
        async.script.sequence([
          qa.state.copy(browserConfigPath, hostnamePath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(portPath, null),
        async.script.sequence([
          qa.state.copy(configPath + '/port', portPath)
        ])
    ),
    async.script.if(
        qa.state.condition.equalsTo(desiredCapabilitiesPath +
        '/desiredCapabilities', null),
        async.script.sequence([
          qa.state.copy('/selenium/default-browser-config',
              desiredCapabilitiesPath)
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
          qa.state.assert.exists('sessionId', 'New session created'),
          qa.state.load('sessionId')
        ])
    )
  ]);
};


/**
 * Шаг получает ID сессии из предыдущего и закрывает эту сессию.
 * @return {!async.Sequence} Созданный шаг.
 */
qa.ext.selenium.deleteSession = function() {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/delete-session/request';
  var responsePath = '/selenium/delete-session/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
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
qa.ext.selenium.setURL = function(URL) {
  var configPath = '/selenium-conf/params';
  var requestPath = '/selenium/messages/easy-post/request';
  var responsePath = '/selenium/set-url/response';
  var hostnamePath = requestPath + '/params/hostname';
  var portPath = requestPath + '/params/port';

  return async.script.sequence([
    qa.state.useInput(
        qa.state.append(requestPath + '/params/path')
    ),
    qa.state.appendString(requestPath + '/params/path', '/url'),
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
    qa.state.setup(requestPath + '/payload/url', URL),
    qa.ext.net.createClient('selenium'),
    qa.state.load(requestPath + '/payload'),
    qa.util.encodeJson,
    qa.ext.net.request(requestPath + '/params', responsePath, 'selenium'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'URL changed'),
    qa.state.cutURL(requestPath + '/params/path'),
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
qa.ext.selenium.locateElement = function(using, value) {
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
    qa.state.useInput(
        async.script.sequence([
          qa.state.load('value/ELEMENT'),
          qa.state.assert.exists('value/ELEMENT', 'Element find')
        ])
    ),
    qa.state.cutURL(requestPath + '/params/path'),
    qa.ext.net.destroyClient('selenium')
  ]);
};


/**
 * Нажать мышью на элемент, "ID" которого пришел в шаг
 *
 * @return {!async.Sequence}
 */
qa.ext.selenium.clickElement = function() {

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
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.cutURL(requestPath + '/params/path'),
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
qa.ext.selenium.addValue = function(text) {

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
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.cutURL(requestPath + '/params/path'),
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
qa.ext.selenium.submitElement = function() {

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
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.cutURL(requestPath + '/params/path'),
    qa.state.assert.equalsTo(responsePath + '/status',
        204, 'Element submited'),
    qa.ext.net.destroyClient('selenium')
  ]);
};
