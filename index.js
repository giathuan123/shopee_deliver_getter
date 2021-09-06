const { shopeeGetter } = require('./shopeeGetter.js');
const { insertData, getLinks} = require('./helper.js');
const { cin } = require('./read.js');

async function main(){
  urls = [];
  const search = await cin("Please enter search word: ");
  console.log("Searching... ", search);
  const db = await require("./data/db.js") 
  const ans = await getLinks(urls, search);
  const getter = await new shopeeGetter();
  while(urls.length != 0){
    getter.url = urls.shift();
    console.log(await getter.data);
    await insertData(db, await getter.data);
    console.log("[INFO] urls left", urls.length);
  }
  db.close(err=>console.log(err));
  console.log("Ending");
};

main();
