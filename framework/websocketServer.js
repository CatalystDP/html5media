var ws = require('ws');
var json = require('./lib/jsonparse');
var log4js=require('log4js');
var rooms = {};
var port=10000;
var server = new ws.Server({
    port: port
});
(function(server){
    server.on('error',function(err){
        console.log(err);
    });
})(server);
var eventHandle = {
    onClose: function (code, message) {
        console.log(this.uuid + ' leaved!\n');
        console.log('close code: ' + code + '\n');
        console.log('close message: ' + message + '\n');
        var index = rooms.indexOf(this);
        rooms.splice(index, 1);
        serverBroadcast({
            'action': 'userdisconnect',
            'msg': this.uuid
        });
        console.log('rooms', rooms);
    },
    onMessage: function (data, flags) {
        _parseForServer(this, data);
    }
    ,
    onError: function (err) {
        console.log(err);
    }
};//this 代表当前socket对象
var serverAction = {
    createroom: function (socket, data) {
        var roomName = data.msg;
        var roomId = generateRoomId();
        if (!roomId) {
            sendMessage(socket, {
                action: 'createroom',
                status: false
            });
            return;
        }
        var room = new RoomModel(roomId, roomName, socket);
        rooms[roomId] = room;
        sendMessage(socket, {
            action: 'createroom',
            status:true,
            msg:{
                roomname:roomName,
                roomid:roomId
            }
        });
    }
};
server.on('connection', function (socket) {
    socket.uuid = id();
    console.log('user ' + socket.uuid + ' connected!');
    console.log('rooms', rooms);
    socket.on('message', eventHandle.onMessage);
    socket.on('error', eventHandle.onError);
    socket.on('close', eventHandle.onClose);
});
function _parseForServer(socket, data) {
    var _data = json.jsonParse(data);
    if (!!_data) {
        if (serverAction.hasOwnProperty(_data.action)) {
            serverAction[_data.action](socket, _data);
        } else {
            broadcast(socket, data);
        }
    }
    return false;
}//当传来的数据满足服务器端的action时

function sendUuid(socket) {

}
function sendMessage(socket, data) {
    socket.send(JSON.stringify(data));
}
function broadcast(socket, data) {
    rooms.forEach(function (item) {
        item.uuid != socket.uuid && item.send(data);
    });
}
function serverBroadcast(data) {
    rooms.forEach(function (item) {
        item.send(data);
    });
}
function generateRoomId() {
    var roomid = null;
    var count = 0;
    do {
        ++count;
        roomid = Math.floor(Math.random() * 1000);
    } while (rooms.hasOwnProperty(roomid) && (count <= 10));
    return roomid;
}
function id() {
    return (+new Date()) + '' + Math.floor(Math.random() * 100000);
}
/**
 *
 * @param id 房间id
 * @param name 房间名
 * @param master 房主
 * @constructor
 */
function RoomModel(id, name, master) {
    this.id = id;
    this.name = name;
    this.master = master;
    this.users = [this.master];
}
RoomModel.prototype.addUser = function (user) {
    this.users.push(user);
};
RoomModel.prototype.removeUser = function (user) {
    var index = this.users.indexOf(user);
    this.users.splice(index, 1);
    if (user.uuid == this.master.uuid) {
        this.master = this.users[0];
    }
};