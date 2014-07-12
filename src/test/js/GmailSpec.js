require('./env');
var MockGmail = require('../../../index');

describe('fakeGmail', function() {
  var subject;
  var authClient;
  var client;
  
  beforeEach(function(done) {
    subject = MockGmail();
    authClient = {};
    
    subject.discover('gmail', 'v1').execute(function(err, _client) {
      client = _client;
      done();
    });
  });
  
  it('should return no threads when there are no messages added', function(done) {
    client.gmail.users.threads.list({ userId: 'me', q: 'in:inbox' }).withAuthClient(authClient).execute(function(err, res) {
      expect(err).to.be.null;
      expect(res.threads).to.eql([]);
      done();
    });
  });
  
  describe('with messages added', function() {
    beforeEach(function() {
      var message = {id: 'M1', threadId: 'T1'};
      subject.addMessage(message);
    });
    
    describe('users.threads.list', function() {
      var res;
      
      beforeEach(function(done) {
        client.gmail.users.threads.list({ userId: 'me', q: 'in:inbox' }).withAuthClient(authClient).execute(function(err, _res) {
          expect(err).to.be.null;
          res = _res;
          done();
        });
      });

      it('should return threads', function() {
        expect(res.threads[0].id).to.equal('T1');
      });
      
      it('should not include the messages', function() {
        expect(res.threads[0].messages).to.be.undefined;
      });
    });
    
    describe('users.threads.get', function() {
      it('should return the list of messages', function(done) {
        client.gmail.users.threads.get({ userId: 'me', id: 'T1'}).withAuthClient(authClient).execute(function(err, res) {
          expect(err).to.be.null;
          expect(res.messages[0].id).to.equal('M1');
          done();
        });
      });
      
      it('should return error for invalid thread id', function(done) {
        client.gmail.users.threads.get({ userId: 'me', id: 'BAD_ID'}).withAuthClient(authClient).execute(function(err, res) {
          expect(err).to.eql({
            errors: [ {
              domain: 'global',
              reason: 'invalidArgument',
              message: 'Invalid id value'
            } ],
            code: 400,
            message: 'Invalid id value'
          });
          expect(res).to.be.null;
          done();
        });
      });
    });
  });
});