const request = require("request");
const cheerio = require("cheerio");
const url =
  "https://myshop.pk/mobiles-smartphones-tablets?product_list_limit=64";

request(url, (error, response, html) => {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);
    $(".product-item-info").each((i, el) => {
      const names = $(el).find(".product-item-name").text();
      console.log(names);
      const price = $(el).find(".price-final_price").text();
      console.log(price.trim().split("  ")[0]);
    });
  }
});
