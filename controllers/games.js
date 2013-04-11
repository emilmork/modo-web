var GameController = exports.Pages = function () {

};

exports.setup = function (io,server,actionhero) {
	var controller = new GameController();
	var A = new actionhero;

	A.connect({host: '0.0.0.0',post: '5000'});


	io.listen(server).on('connection', function (socket) {
		console.log("Connected with GAMESERVER");

		socket.on('sendAction',function(action,params,callback){


			A.actionWithParams(action,params,function(err,apiResposne,delta){
				if(err)console.log("Error on apiResponse" + err);
				callback(apiResposne);
			});
		});

	});
};


