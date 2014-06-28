/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var fs = require('fs');
var db = require('../SQL/db.js');
var qs = require('querystring');

var obj = {};
obj.results = [];
//obj.results = JSON.parse(fs.readFileSync('messages.txt')).results;

exports.handler = function(request, response) {

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var statusCode;
  var urlArray = request.url.split('/');

  if (request.method === 'GET' && urlArray[1] === 'classes') {

    statusCode = 200;
    response.writeHead(statusCode, headers);

    // var readMessages = fs.readFileSync('../messages.txt');

    db.selectMessages('black hole', function(msgArray) {
      var results = {};
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

      //msg = qs.parse(msg);
      obj.results.unshift(msg);
      // eventually call save to database

      console.log('msg=' + obj);
      // Grab user name and check if the user has already been
      // entered in the database.

      // Select user by name should either select the record and
      // return the contents or insert the record and return the
      // contents.
      // db.selectUserByName(userName, function(err, data) {{
      //   if (err) {
      //     console.log('Error on selectUserByName. err=' + err);
      //   } else {
      //     // Should have something like {id: ??, name: joe}

      //     // Once we have the user object & room object, we
      //     // can save the message


      //     console.log(data);
      //   };
      // }});
      fs.writeFileSync('messages.txt', msg);
      response.end(msg);

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
