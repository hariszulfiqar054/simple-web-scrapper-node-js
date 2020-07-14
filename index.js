const request = require("request");
const cheerio = require("cheerio");
const xl = require("excel4node");
const fs = require("fs");
let wb = new xl.Workbook();
let sheet = wb.addWorksheet("Sheet 1");
var nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const url =
  "https://myshop.pk/mobiles-smartphones-tablets?product_list_limit=64";

const data = [];

//Scrapping data from web
request(url, (error, response, html) => {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);
    $(".product-item-info").each((i, el) => {
      const names = $(el).find(".product-item-name").text();
      const price = $(el).find(".price-final_price").text();
      let final_price = price.trim().split("  ")[0];
      data.push({ name: names, price: final_price });
    });
  }
});

setTimeout(() => {
  excelOperation(data);
}, 4000);

//Performing excel operation
const excelOperation = (data) => {
  for (let i = 0; i < data.length; i++) {
    sheet.cell(i + 1, 1).string(data[i].name);

    sheet.cell(i + 1, 2).string(data[i].price);
  }
  wb.write("Excel.xlsx");
  setTimeout(() => {
    fs.readFile("./Excel.xlsx", (err, data) => {
      // console.log(data);
      transporter
        .sendMail({
          sender: process.env.EMAIL,
          to: process.env.EMAIL,
          subject: "Attachment!",
          body: "mail content...",
          attachments: [{ filename: "Excel.xlsx", content: data }],
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    });
  }, 2000);
};
