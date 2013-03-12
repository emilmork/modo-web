var GameController = exports.Pages = function () {

};

exports.setup = function (io,server,actionhero) {
	var controller = new GameController();
	var A = new actionhero;

	A.connect({host: '127.0.0.1',post: '5000'});


	io.listen(server).on('connection', function (socket) {
		//Send action to game server and return callback
		socket.on('sendAction',function(action,params,callback){
			console.log("sendAction");
			A.actionWithParams(action,params,function(err,apiResposne,delta){
				callback(apiResposne);
			});
		});

	});


};


