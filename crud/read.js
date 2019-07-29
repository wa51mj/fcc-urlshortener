var Collection = require('../model');

function read (num){
  return Collection.findOne({shortUrl: num}, function(err, record){
    record ? console.log(`record found`) : console.log(`record not found`)
  });
}

module.exports = read;