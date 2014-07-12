module.exports = function() {
  var threads = [];
  return {
    addMessage: function(message) { 
      // threads.push({});
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
                            var res = { threads: threads };
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