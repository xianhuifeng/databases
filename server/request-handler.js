/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var fs = require('fs');
var db = require('../SQL/db.js');
var qs = require('querystring');

exports.handler = function(request, response) {

  var roomName = 'black hole';

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var statusCode;
  var urlArray = request.url.split('/');

  if (request.method === 'GET' && urlArray[1] === 'classes') {

    db.selectMessages(roomName, function(err, msgArray) {
      var results = {};
      statusCode = 200;
      response.writeHead(statusCode, headers);
      results['results'] = msgArray;
      response.end(JSON.stringify(results));
    });

  } else if(request.method === 'POST' && urlArray[1] === 'classes') {
    var msg = '';

    request.on('data', function(chunk){
      msg += chunk;
    });
    request.on('end', function() {
      statusCode = 201;
      response.writeHead(statusCode, headers);
      msg = JSON.parse(msg);
      console.log('msg to save: ' + msg);
      db.saveMessage(msg, function(){
        response.end(msg);

      });

      // fs.writeFileSync('messages.txt', msg);
    });
  } else if ( request.method === "OPTIONS") {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end("yolo");
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
