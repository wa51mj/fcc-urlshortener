var dns = require('dns');
var validUrl = require('valid-url');
var url = require('url');

async function isUrlValid(urlToTest) {
  console.log(`testing: ${urlToTest}`)
  let urlTestResult = null;
  
  let validSyntax = (isSyntaxValid(urlToTest)) ? true : false;
  console.log(`${urlToTest} syntax is valid: ${validSyntax}`)
  
  if(validSyntax) {
    let lookup = await dnsLookup(urlToTest)
    lookup.err ? console.log(`invalid host`) :  console.log(`valid host: ${lookup.address}`)
    urlTestResult = (lookup.err) ? false: true;
  }
  else {
    urlTestResult = false;
  }
  console.log(`test result: ${urlTestResult} \n`)
  return urlTestResult;
}


function isSyntaxValid(url) {
  return validUrl.isWebUri(url);
}

function dnsLookup(urlToTest){

  // dns look up is asynchronous so I have wrapped it in a promise;
  return new Promise( (resolve, reject) => {
    let host = getHost(urlToTest);
    dns.lookup(host, function(err, address, family){
      resolve({err, address, family})
    })
  })
  
  function getHost(urlToTest) {
    urlToTest = new URL(urlToTest);
    let host = urlToTest.host;
    return host;
  }
}


module.exports = {isSyntaxValid, dnsLookup, isUrlValid};