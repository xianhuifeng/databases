
/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

var http = require("http");
var db = require("./db");

var port = 8080;
var ip = "127.0.0.1";

// not sure what method name to pass in here...
var server = http.createServer(db.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);


