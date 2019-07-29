var Collection = require('./model');
var read = require('./crud/read')

async function shortUrl(url) {
  let result = {};
  // if url can be found in the collection return corresponding short url
  
  console.log(`searching for ${url}`);
  let searchResult = await searchForUrl(url);
  
  if(searchResult) {
    console.log("url found");
    let short = searchResult.shortUrl;
    result = {short, newShort: false}
  }
  // else find last record, increment and use 
  else {
    console.log("url not found");
    let short =  await getLastRecord();
    result = {short, newShort: true}
  }
  console.log(result)
  return result;
}

function searchForUrl(url){
  return Collection.findOne({url: url}, function(err, record){
    record ? console.log(`url already exists \n`) : console.log(`url does not exist \n`)
  });
}

async function getLastRecord() {
  let lastRecord = await Collection.findOne().sort({ field: 'asc', _id: -1 });
  if(lastRecord){
    console.log("last record located")
    return lastRecord.shortUrl + 1;
  }
  else{
    console.log("no records exist")
    return 1;
  }
}
module.exports = shortUrl;

// Collection.findOne().sort({ field: 'asc', _id: -1 })