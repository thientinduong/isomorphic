'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
os.tmpDir = os.tmpdir;


//Configure nunjucks to read from the dist directory
_nunjucks2.default.configure('./dist');

//Create a server with a host and port
var server = new _hapi2.default.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

//Get name
function getName(request) {
  //default value
  var name = {
    fname: 'Tin',
    lname: 'Duong'
  };

  //split path params
  var nameParts = request.params.name ? request.params.name.split('/') : [];

  //order of precedence
  //1. path param
  //2. query param
  //3. defaul value
  name.fname = nameParts[0] || request.query.fname || name.fname;
  name.lname = nameParts[1] || request.query.lname || name.lname;

  return name;
}

//Add the route
server.route({
  method: 'GET',
  path: '/hello/{name*}',
  handler: function handler(request, reply) {
    //read template and compile using context object
    _nunjucks2.default.render('index.html', getName(request), function (err, html) {
      //reply with HTML response
      reply(html);
    });
  }
});

//Start the server
server.start();