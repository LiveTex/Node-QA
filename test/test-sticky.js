qa = require('../bin/index.js');
qa = require('config');

suite.setUp(function(tastCase, complete, cancel) {
  var visitor = new qa.business.entity.Visitor(config.site);
  testCase.addVisitor(visitor);

  visitor.setPollingChannel('visitor#io-polling');
  this.attachConnection(visitor.getIoAuthChannel(),
      new qa.business.comm.IoServerConnection(config.io_server));

  visitor.setIoAuthChannel('visitor#io-auth');
  this.attachConnection(visitor.getPollingChannel(),
      new qa.business.comm.PollingServerConnection(config.io_server));

  visitor.setChatServerChannel('visitor#chat-server');
  this.attachConnection(visitor.getChatServerChannel(),
      new qa.business.comm.ChatServerConnection());

  var member = new qa.business.entity.Member(config.member.login,
      config.member.password);
  testCase.addMember(member);

  this.attachConnection(member.getName(),
      new new qa.business.comm.ChatServerConnection());
});

suite.tearDown(function() {});

var visitor = qa.business.visitor;
var member = qa.business.member;

suite.addStep(
    async.parallel([
      async.sequence([
        visitor.openSite([
          lock.barrier('auth'),
          visitor.selectAvailableMember,
          visitor.openChat([
            async.barrier('chat'),
            visitor.assert.ChatOpened
          ])
        ]),
        visitor2.openSite([
          lock.barrier('auth2'),
          visitor2.selectAvailableMember,
          visitor2.openChat([
            async.barrier('chat2'),
            visitor2.assert.ChatOpened,
            visitor.openSite([
              lock.barrier('auth3'),
              visitor.selectAvailableMember,
              visitor.openChat([
                async.barrier('chat3'),
                visitor.assert.ChatOpened,
                visitor.assertRobomember
              ])
            ])
          ])
        ])
      ]),

    ]));


/**
 *
 */
var visitor.openSite = function(list) {
  return async.sequence([
    visitor.auth
  ].concat(list).concat(visitor.leaveSite));
};


testCase.client[0].scenario(
    async.sequence([
      visitor.openSite([
        lock.barrier('auth'),
        visitor.selectAvailableMember,
        visitor.openChat([
          async.barrier('chat'),
          visitor.assert.ChatOpened
        ])
      ]),
      lock.barrier('close'),
      async.barrier('chat2-opened'),
      visitor.openSite([
        lock.barrier('auth3'),
        visitor.selectAvailableMember,
        visitor.openChat([
          async.barrier('chat3'),
          visitor.assert.ChatOpened
        ])
      ])
    ]));

testCase.client[1].scenario(
    async.sequence([
      async.barrier('close'),
      visitor.openSite([
        lock.barrier('auth2'),
        visitor.selectAvailableMember,
        visitor.openChat([
          async.barrier('chat2'),
          visitor.assert.ChatOpened,
          async.barrier('chat2-opened')
        ])
      ])
    ]));

testCase.client[2].scenario(
    async.sequence([
      member.login([
        member.assert.maxChats(1),
        lock.barrier('auth'),
        member.assert.visitorListLength(1),
        lock.barrier('chat'),
        member.assert.ChatOpened,
        lock.barrier('auth2'),
        member.assert.visitorListLength(1),
        lock.barrier('chat2'),
        member.assert.ChatOpened,
        lock.barrier('auth3'),
        member.assert.visitorListLength(2),
        lock.barrier('chat3'),
        member.assert.ChatNotOpened
      ])
    ])
)