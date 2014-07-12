module.exports = function() {
  var threads = [];
  return {
    addMessage: function(message) { 
      threads.push({ id: message.threadId, messages: [ message ]});
    },
    
    discover: function() {
      return {
        execute: function(callback) {
          var err;
          var client = {
            gmail: {
              users: {
                threads: {
                  list: function() {
                    return {
                      withAuthClient: function() {
                        return {
                          execute: function(callback) {
                            var err;
                            var res = { threads: threads.map(function (t) {
                              return { id: t.id };
                            }) };
                            callback(err, res);
                          }
                        }
                      }
                    }
                  },
                  get: function(id) {
                    return {
                      withAuthClient: function() {
                        return {
                          execute: function(callback) {
                            var err;
                            var res = threads[0];
                            callback(err, res);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          callback(err, client);
        }
      }
    }
  };
};