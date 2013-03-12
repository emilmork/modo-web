;(define(['jquery','socket'], function ( $ ) {
    var socket = io.connect();

  return {
    render: function (ev, data) {
      if (!data || data.length < 1) {
        return; 
      }
    console.log("render");

    },
    showError: function (ev, data) {


    },

    connection: function(){
      console.log("returning socket");
      return socket;
    },


    sendAction: function (action,params,callback) {
      socket.emit('sendAction',action,params,function(cb){
        callback(cb);
      });
    }
  };
}));