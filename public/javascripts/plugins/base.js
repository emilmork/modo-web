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


    sendAction: function (action,params,callback) {
      console.log("[BASE] sending action: " + action + "...");
      socket.emit('sendAction',action,params,function(cb){
        console.log("[BASE] response received.");
        callback(cb);
      });
    }
  };
}));