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

var selectUsers = function(callback) {
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

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

exports.selectUsers = selectUsers;
