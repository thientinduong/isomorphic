var os = require('os');
os.tmpDir = os.tmpdir;
import Hapi from 'hapi';
import nunjucks from 'nunjucks';

//Configure nunjucks to read from the dist directory
nunjucks.configure('./dist');

//Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

//Get name
function getName(request) {
  //default value
  let name = {
    fname: 'Tin',
    lname: 'Duong',
  };

  //split path params
  let nameParts = request.params.name ? request.params.name.split('/') : [];

  //order of precedence
  //1. path param
  //2. query param
  //3. defaul value
  name.fname = (nameParts[0] || request.query.fname || name.fname);
  name.lname = (nameParts[1] || request.query.lname || name.lname);

  return name;
}

//Add the route
server.route({
  method: 'GET',
  path: '/hello/{name*}',
  handler: function (request, reply) {
    //read template and compile using context object
    nunjucks.render(
      'index.html',
      getName(request),
      function(err, html) {
        //reply with HTML response
        reply(html);
      }
    );
  }
});

//Start the server
server.start();
