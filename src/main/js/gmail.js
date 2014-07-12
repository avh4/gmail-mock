module.exports = function() {
  var threads = [];
  var threadIndex = {};
  return {
    addMessage: function(message) {
      var thread = { id: message.threadId, messages: [ message ]};
      threads.push(thread);
      threadIndex[thread.id] = thread;
    },
    
    discover: function() {
      return {
        execute: function(callback) {
          var client = {
            gmail: {
              users: {
                threads: {
                  list: function() {
                    return {
                      withAuthClient: function() {
                        return {
                          execute: function(callback) {
                            var res = { threads: threads.map(function (t) {
                              return { id: t.id };
                            }) };
                            callback(null, res);
                          }
                        }
                      }
                    }
                  },
                  get: function(params) {
                    return {
                      withAuthClient: function() {
                        return {
                          execute: function(callback) {
                            var res = threadIndex[params.id];
                            if (res) {
                              callback(null, res);
                            } else {
                              callback({
                                errors: [{
                                  domain: 'global',
                                  reason: 'invalidArgument',
                                  message: 'Invalid id value'
                                }],
                                code: 400,
                                message: 'Invalid id value'
                              }, null);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          callback(null, client);
        }
      }
    }
  };
};