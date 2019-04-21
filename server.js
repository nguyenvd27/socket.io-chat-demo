var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];//mảng lưu danh sách user
connections = [];

server.listen(process.env.PORT || 3001);
console.log('Server running....');

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected ', connections.length);

	//Disconnect
	socket.on('disconnect', function(data){
		//if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);// splice là xóa bỏ phần tử, indexOf là tìm kiếm phần tử có trong mảng
		updateUsernames();

		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length );
	})
	
	// Send Message
	socket.on('send message', function(data){
		//console.log(data);
		io.sockets.emit('mew message', {msg: data, user: socket.username});// io.sockets.emit là phát cho tất cả
	})

	//New User
	socket.on('new user', function(data, callback){
		callback(true);
		if(users.indexOf(data)>=0){
			//fail
			socket.emit("login that bai");
		}else{
			// thanh cong
			socket.username = data;
			users.push(socket.username);
			socket.emit("login thanh cong", socket.username);
			updateUsernames();
		}
		
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}


	//Soan tin nhan
	// socket.on('Soan tin nhan',function(){
	// 	console.log('co nguoi dang soan tin nhan');
	// 	var s = "ai do dang soan tin";
	// 	socket.broadcast.emit('co nguoi dang soan tin',s);
	// 	//io.sockets.emit('co nguoi dang soan tin',s);
	// });
	// socket.on('khong soan tin',function(){
	// 	//console.log('co nguoi dang soan tin nhan');
	// 	socket.broadcast.emit('stop go chu');
	// 	//io.sockets.emit('stop go chu');
	// });
});