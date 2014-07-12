require('./env');
var MockGmail = require('../../../index');

describe('fakeGmail', function() {
  var subject;
  var authClient;
  
  beforeEach(function() {
    subject = MockGmail();
    authClient = {};
  });
  
  it('should return no threads when there are no messages added', function(done) {
    subject.discover('gmail', 'v1').execute(function(err, client) {
      client.gmail.users.threads.list({ userId: 'me', q: 'in:inbox' }).withAuthClient(authClient).execute(function(err, res) {
        expect(res.threads).to.eql([]);
        done();
      })
    })
  });
  
  // it('should return threads for added messages', function(done) {
  //   var message = {threadId: 'T1'};
  //   subject.addMessage(message);
  //
  //   subject.discover('gmail', 'v1').execute(function(err, client) {
  //     client.gmail.users.threads.list({ userId: 'me', q: 'in:inbox' }).withAuthClient(authClient).execute(function(err, res) {
  //       expect(res.threads[0].messages[0]).to.eql(message);
  //       done();
  //     })
  //   })
  // });
});