var Record = require('../model');

function create(num, url) {
  var recordToAdd = new Record({shortUrl:num, url:url});
  return recordToAdd.save( function(err){
    err ? console.log(`record not saved \n`) : console.log(`record saved \n`)
  });
}
                               
module.exports = create;