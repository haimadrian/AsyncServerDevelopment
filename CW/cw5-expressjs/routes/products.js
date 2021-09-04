const express = require('express');
const router = express.Router();
const mongo = require('../mongo-singleton.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let cellAlignedCenter = function (thOrTd, text) {
    return `<${thOrTd} style="text-align:center">${text}</${thOrTd}>`;
  }

  mongo.find((error, products) => {
    if (error) {
      console.error(`Failed finding documents. Reason: ${error}`);
    } else {
      let tableParts = [`<table><tr>${cellAlignedCenter('th', 'Image')}${cellAlignedCenter('th', 'Name')}${cellAlignedCenter('th', 'Price')}</tr>`];

      for (const product of products) {
        product.printDetails();
        tableParts.push(`<tr><td><img src="images/${product.image}" width="200px" alt="${product.image}"/></td>${cellAlignedCenter('td', product.name)}${cellAlignedCenter('td', product.price + "$")}</tr>`);
      }

      res.send(createHtml('Products', tableParts.join('')));
    }
  });
});

function createHtml(title, text) {
  return "<!DOCTYPE html>\n" +
      "<html lang=\"en\">\n" +
      "<head>\n" +
      "    <meta charset=\"UTF-8\">\n" +
      "    <title>" + title + "</title>\n" +
      "    <style>\n" +
      "        td, th\n" +
      "        {\n" +
      "            padding:2px 15px;\n" +
      "        }\n" +
      "    </style>" +
      "</head>\n" +
      "<body>\n" +
      "<h1>" + title + "</h1>\n" +
      "<p>\n" +
      text +
      "\n</p>\n" +
      "</body>\n" +
      "</html>";
}

module.exports = router;
