const puppeteer = require('puppeteer');
const BOX_SELECTOR = 'div.shopee-drawer';
const PARTNER_SELECTOR  = 'div._3NgYBG';
const SHOP_NAME_SELECTOR = 'div._3uf2ae';
class shopeeGetter{
  static __browser = null;
  static __opts = {
    headless: true
  };

  constructor(url){
    return new Promise(async (res)=>{
        this.url = url;
        if(shopeeGetter.__browser==null){
        shopeeGetter.__browser = 1;
        shopeeGetter.__browser = await puppeteer.launch(shopeeGetter.__opts);
        this.page = (await shopeeGetter.__browser.pages())[0];
        }else{
        this.page = await shopeeGetter.__browser.newPage(); 
        }
        res(this);
        });
  }

  get deliver_partner(){
    return (async ()=>{
        if(this.url != await this.page.url()){
          await this.page.goto(this.url);
        }

        await this.page.waitForFunction((BOX_SELECTOR)=>{return document.querySelectorAll(BOX_SELECTOR).length >= 2 },{}, BOX_SELECTOR)
        const boxHandle = ( 
            await this.page.evaluate(
              (BOX_SELECTOR)=>document.querySelectorAll(BOX_SELECTOR).length, BOX_SELECTOR
              )) 
        == 2 ? (await this.page.$$(BOX_SELECTOR))[1] : (await this.page.$$(BOX_SELECTOR))[2];
        return await this.page.evaluate((boxHandle, PARTNER_SELECTOR)=>{
            const key = Object.keys(boxHandle);
            boxHandle[key[1]].onMouseEnter();
            return Array.from(document.querySelectorAll(PARTNER_SELECTOR)).map(a=>a.innerText);
            },boxHandle , PARTNER_SELECTOR);
        })();
  }

  get shop_name(){
    return (async()=>{
        if(this.url != await this.page.url()){
          await this.page.goto(this.url);
        }
        const shopNameBox = await this.page.waitForSelector(SHOP_NAME_SELECTOR);
        return await this.page.evaluate(e=>e.innerText, shopNameBox);
        })();
  }

  get data(){
    if (this.url == undefined) throw new Error('url undefined');
    return (async ()=>{ return { shop_name: await this.shop_name, deliver_partner: await this.deliver_partner}})();
  }
}
module.exports = {
shopeeGetter: shopeeGetter
}
