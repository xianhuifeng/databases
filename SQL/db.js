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
    if (err) {
      console.log('error :' + err);
      return JSON.stringify({results:[]});
    }

    var msgArray = [];
    for (var x=0; x<rows.length; x++) {
      var row = rows[x];
      console.log(row.username);
      var msg =
        { username: row.username,
          text: row.text,
          roomname: row.roomname
        };
      msgArray.push(msg);
    }
    callback(msgArray);
  });

  // Take all returned message objects and put them into an array
  // Add array to another object with the key of 'results'

  // Return JSON.stringify(results)



  // Select details about the room.

}

// exports.selectMessages = selectMessages = function(callback) {
//   // callback takes err & rows -- callback(err, rows)
//   dbConnection.query('select * from message', callback);

// };

exports.selectRooms = selectRooms = function(callback) {
  // callback takes err & rows -- callback(err, rows)
  dbConnection.query('select * from room', callback);

};

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

