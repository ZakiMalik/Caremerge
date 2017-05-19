//adding test comment again
//-------------------- Require in Node Modules---------------------//
var express = require ("express");
//-------------------- Include services ---------------------------//
var config = require("./services/config.js");
var getPageTitle = require("./services/utils.js").getPageTitle;
// instantiate app as new express server instance
var app = express();
// setting the app's view engine to ejs. EJS templates can be found under views directory
app.set('view engine', 'ejs');

app.get('/I/want/title', function(req,res){
  var addresses = req.query.address;
  if(!addresses){
    return res.status(400).send("Mandatory parameters missing! Bad Request.");
  }
  if(typeof addresses == "string"){
    addresses = [addresses];
  }

  var count = 0;
  var titles = [];
  var urlRegex = new RegExp (/^http:\/\//);
  var titleRegex =  new RegExp (/<\s*title\s*>.*<\s*\/\s*title\s*>/);
  addresses.forEach(function(addr){
   getPageTitle(addr, urlRegex, titleRegex, function(err, title){
     if(err){
       console.log(err);
       return res.status(500).send("Internal Server Error");
     }else{
       titles.push(title);
       count++;
       if(count === addresses.length){
        return res.render('pages/response',{titles: titles})
       }
     }
   });
 });
});

// Setup 404 for requests to undefined route urls
app.all('*', function(req, res){
  return res.status(404).send("The Requested route does not exist!");
});

// Start express server on port specified in config as SERVER_PORT
app.listen(config.SERVER_PORT, function(){
  console.log("Express server started at port " + config.SERVER_PORT);
});
