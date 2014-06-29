var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect(function(err){
  if (err) {
    console.error('error connection: ' + err.stack);
    return;
  }
  console.log('connected');
});

exports.insertUser = insertUser = function(user , callback){
  dbConnection.query('INSERT INTO user SET ?', user, callback);
};
exports.insertMessage = insertMessage = function(message , callback){
  dbConnection.query('INSERT INTO message SET ?', message, callback);
};
exports.insertRoom = insertRoom = function(room , callback){
  dbConnection.query('INSERT INTO room SET ?', room, callback);
};

exports.selectUsers = selectUsers = function(callback) {
  // callback takes err & rows -- callback(err, rows)
  dbConnection.query('select * from user', callback);
  //   function(err, rows) {
  //   if (err) {
  //     console.error('error on query: ' + err.stack);
  //   }
  //   for (var x=0; x<rows.length; x++) {
  //     console.log(rows[x].id + ' ' + rows[x].name);
  //   }
  // });
};

exports.saveMessage = saveMessage = function(msg, callback) {
  // Msg should be like this:
  //{"username":"jkh","text":"uhuhu","roomname":"black hole"}

  console.log('finding ' + msg.roomname);
  console.log('finding user ' + msg.username);

  // What is the ID of the room?
  var room = selectRoomByName(msg.roomname, function(err, room) {
    console.log('room is ' + room);
    if (room.id === undefined) {
      room = insertRoom(msg.roomname, function(err, room) {
        if (err) {
          console.log('error inserting room');
        }
      });
    }
    var user = selectUserByName(msg.username, function(err, user) {
      if (user.id === undefined) {
        user = insertUser(msg.username, function(err, user) {
          if (err) {
            console.log('error inserting user');
          }
        });
      }

      // Now we're ready for the insert
      console.log('room = ' + room.name);
      console.log('user = ' + user.name);
      dbConnection.query('insert into message (user_id, room_id, text, time) values ' +
                         '(' + user.id + ',' + room.id + ',"' + msg.text + '", now());',
        function(){});
    });
  });


  // insert into message
  // (user_id, room_id, text, time)
  // values
  // (user.id, room.id, msg.text, now())

};

exports.selectMessages = selectMessages = function(roomName, callback) {
  // return array of messages like this:
  // {"results":[{"username":"david","text":"something","roomname":"black hole"},
  // {"username":"david","text":"iuhuh","roomname":"black hole"}]}

  // retrieve the id for the given roomName (hardcode for first use case)
  roomName = 'black hole';

  // select u.name as username, m.text as text, r.name as roomname
  // from message m, room r, user u
  // where m.room_id = r.id
  // and m.user_id = u.id
  // and r.name = 'black hole'
  // order by m.time desc
  var select =
    'select u.name as username, m.text as text, r.name as roomname ' +
    'from message m, room r, user u ' +
    'where m.room_id = r.id ' +
    'and m.user_id = u.id ' +
    'and r.name = "' + roomName + '" ' +
    'order by m.time desc';

  dbConnection.query(select, function(err, rows) {
    // loop through the results and populate our objects
    // {username: u.name, text: m.text, roomname: r.name}
    var msgArray = [];
    if (err) {
      console.log('error :' + err);
      callback(err, msgArray);
    }

    for (var x=0; x<rows.length; x++) {
      var row = rows[x];
      var msg =
        { username: row.username,
          text: row.text,
          roomname: row.roomname
        };
      msgArray.push(msg);
    }
    callback(err, msgArray);
  });
};

exports.selectRoomByName = selectRoomByName = function(name, callback) {
  dbConnection.query('select * from room where name = "' + name + '"', function(err, row) {
    var room = {};
    if (err) {
      console.log('error :' + err);
      callback(err, room);
    }

    if (row.length > 0) {
      room.id = row[0].id;
      room.name = row[0].name;
    }
    callback(err, room);
  });
};

exports.insertRoom = insertRoom = function(name, callback) {
  dbConnection.query('insert into room (name) values ("' + name + '")', function(err, row) {
    var room = {};
    if (err) {
      console.log('error :' + err);
      callback(err, room);
    }

    if (row.length > 0) {
      room.id = row.id;
      room.name = row.name;
    }
    callback(err, room);
  });
};

exports.selectUserByName = selectUserByName = function(name, callback) {
  console.log('user ' + name);

  dbConnection.query('select * from user where name = "' + name + '"', function(err, row) {
    var user = {};
    if (err) {
      console.log('error :' + err);
      callback(err, user);
    }

    if (row.length > 0) {
      console.log('found a row for the user');
      user.id = row[0].id;
      user.name = row[0].name;
    }
    callback(err, user);
  });
};

exports.insertUser = insertUser = function(name, callback) {
  dbConnection.query('insert into user (name) values ("' + name + '")', function(err, row) {
    var user = {};
    if (err) {
      console.log('error :' + err);
      callback(err, user);
    }

    if (row.length > 0) {
      user.id = row.id;
      user.name = row.name;
    }
    callback(err, user);
  });
};

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

