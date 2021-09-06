const pup = require('puppeteer');
const URL = 'https://shopee.sg/search?keyword='; 
const SHOPEE = 'https://shopee.sg';
const INSERT_STATEMENT = 'INSERT OR IGNORE INTO deliver_partner(shop_name, deliver_partner) VALUES (:shop_name,:deliver_partner)';
const PAGE_CONTROLLER_SELECTOR = 'span.shopee-mini-page-controller__total';
const SCRIPT_SELECTOR = 'script[type=\'application/ld+json\']';
const BROWSER_OPTS = {headless: true};

async function insertData(db, data){
  for(const dp of data.deliver_partner){
    await db.run(
      INSERT_STATEMENT,
      {
        ':shop_name': data.shop_name,
        ':deliver_partner': dp
      });
    console.log("Inserting: ", {shopname: data.shop_name, deliver_partner: dp}); 
    }
}

function getLinks(url_array, search){
    return new Promise( async (res, rej)=>{
      const browser = await pup.launch(BROWSER_OPTS);
      const page = (await browser.pages())[0];
      await page.goto(URL+search);
      await page.waitForSelector(PAGE_CONTROLLER_SELECTOR);
          total_pages = await page.evaluate((P_SELECTOR)=>{
          ele = document.querySelector(P_SELECTOR);
          return ele.innerText;
          }, PAGE_CONTROLLER_SELECTOR);
      var current_page = 0;
      while(current_page < total_pages){
        await page.waitForSelector(SCRIPT_SELECTOR);
        await page.waitForTimeout(1000);
        const urls = await page.$$eval(SCRIPT_SELECTOR, 
                a => a.map(as=>JSON.parse(as.innerText)['url']));
        url_array.push(...(urls.filter(u=>u!=SHOPEE)));
        res('URL is available');
        current_page++;
        await page.goto(URL + search + "&page="+current_page);
      }
  });
}

module.exports = {
  getLinks: getLinks,
  insertData: insertData
}
