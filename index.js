/** entry point */
// dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


// server configuration
const server = http.createServer(function createServerCallback(req, res){
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headers = req.headers;
  const decoder = new StringDecoder('utf-8');
  let payload = '';
  req.on('data', function(data){
    payload += decoder.write(data);
  });
  req.on('end', function(){
    payload += decoder.end();

    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    const data = { trimmedPath, queryStringObject, method, headers, payload: helpers.parseJsonToObject(payload) };

    chosenHandler(data, function(statusCode, responsePayload){
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
      responsePayload = typeof(responsePayload) === 'object' ? responsePayload : {};
      const payloadString = JSON.stringify(responsePayload);

      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});

// start server
server.listen(config.PORT, function listenCallback() {
  console.log(`server listening on port ${config.PORT} in ${config.ENV_NAME}`);
});

// request router
const router = {
  'todos': handlers.todos
}
