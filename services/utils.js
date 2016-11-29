//-------------------- Require in Node Modules---------------------//
var request = require ("request");
var requestP = require ("request-promise");
var Q = require ('q');
//----------------------------------------------------------------//

/** This function initiates a call to the provided url and fetches and returns the page title
* in case of no response or error (http statusCode >= 400 ) the title provided back is in the form <addr> - NO RESPONSE
* @param addr: the url to request the page from
* @param urlRegex: used to determine if the url contains http://
* @param titleRegex: used to extract title from response body
* @param cb: the callback function
* @returns title || errMessage
*/
var getPageTitle = function(addr, urlRegex, titleRegex, cb){
  if(!addr || !urlRegex || !titleRegex || !cb){
    var errMessage = "Mandatory arguments for function utils.getPageTitle missing";
    callback(errMessage, null);
  }
  var url = "" + addr;
  if(!addr.match(urlRegex)){
    url = "http://" + addr;
  }
  request(url, function( err, res, body){
    if(err || res.statusCode >= 400){
      cb(null, addr + ' - NO RESPONSE');
    }else{
      var match = body.toString().match(titleRegex)['0'];
      match = match.replace(/<\s*title\s*>/,"");
      match = match.replace(/<\s*\/\s*title\s*>/,"");
      cb(null, addr + ' - "' + match + '"');
    }
  });
}

/** This function initiates a call to the provided url and fetches and returns the page title
* in case of no response or error (http statusCode >= 400 ) the title provided back is in the form <addr> - NO RESPONSE
* @param addr: the url to request the page from
* @param urlRegex: used to determine if the url contains http://
* @param titleRegex: used to extract title from response body
* @returns {*| promise}
*/
var getPageTitlePromisified = function(addr, urlRegex, titleRegex){
  var deferred = Q.defer();
  if(!addr || !urlRegex || !titleRegex){
    var errMessage = "Mandatory arguments for function utils.getPageTitlePromisified missing";
    deferred.reject(errMessage);
  }
  var url = "" + addr;
  if(!addr.match(urlRegex)){
    url = "http://" + addr;
  }

  requestP(url).then(function(res){
      var match = res.toString().match(titleRegex)['0'];
      match = match.replace(/<\s*title\s*>/,"");
      match = match.replace(/<\s*\/\s*title\s*>/,"");
      deferred.resolve(addr + ' - "' + match + '"');
  }).catch(function(err){
    console.log("Request error: " + err);
    deferred.resolve(addr + ' - NO RESPONSE');
  })
  return deferred.promise;
}

/** This function initiates a call to the provided url and fetches and returns the page title
* in case of no response or error (http statusCode >= 400 ) the title provided back is in the form <addr> - NO RESPONSE
* The purpose of this function is to serve as an iteratee for async.map
* @param addr: the url to request the page from
* @param callback: the callback function
* @returns title || errMessage
*/
var getPageTitleAsync = function(addr, callback){
  var urlRegex = new RegExp (/^http:\/\//);
  var titleRegex =  new RegExp (/<\s*title\s*>.*<\s*\/\s*title\s*>/);
  var url = "" + addr;
  if(!addr.match(urlRegex)){
    url = "http://" + addr;
  }
  request(url, function( err, res, body){
    if(err || res.statusCode >= 400){
      callback(null, addr + ' - NO RESPONSE');
    }else{
      var match = body.toString().match(titleRegex)['0'];
      match = match.replace(/<\s*title\s*>/,"");
      match = match.replace(/<\s*\/\s*title\s*>/,"");
      callback(null, addr + ' - "' + match + '"');
    }
  });
}
//--------- The file exports the following functions---------//
module.exports = {
  getPageTitle: getPageTitle,
  getPageTitlePromisified: getPageTitlePromisified,
  getPageTitleAsync: getPageTitleAsync
}
