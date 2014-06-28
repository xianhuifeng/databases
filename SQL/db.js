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

exports.selectMessages = selectMessages = function(callback) {
  // callback takes err & rows -- callback(err, rows)
  dbConnection.query('select * from message', callback);

};

exports.selectRooms = selectRooms = function(callback) {
  // callback takes err & rows -- callback(err, rows)
  dbConnection.query('select * from room', callback);

};

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

