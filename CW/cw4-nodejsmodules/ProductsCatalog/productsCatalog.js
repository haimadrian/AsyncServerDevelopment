/**
 * You should develop a server side application that uses Node.js and Mongoose, that  generates
 * an HTML file that shows a list of products (name, image (file name to read from server's local disk), and price) based
 * on data that already stored in a specific collection in a specific db, maintained on MongoDB Atlas.
 * The HTML file that shows the list of products should include the use of the TABLE element at https://bit.ly/3iIeIeM
 *
 * The image can be returned using an <img src> where the src is a url of the server, so we will return each image like
 * an html file in the WebPageGenerator exercise. See also table with images of pokemon (cw2, studentsarray.html)
 */
const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');

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

function getImage(req, res) {
    let url = req.url.toLowerCase();
    let filePath = url.substring(1);

    fs.readFile(filePath, function (error, data) {
        console.log(`File read: ${filePath}`);

        if (error != null) {
            console.log("Error: " + error);

            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(createHtml('NOT FOUND', req.url + " is not found."));
        } else {
            res.writeHead(200, {'Content-Type': url.endsWith('png') ? 'image/png' : 'image/jpeg'});
            res.end(data);
        }
    });
}

function listProducts(req, res) {
    let cellAlignedCenter = function (thOrTd, text) {
        return `<${thOrTd} style="text-align:center">${text}</${thOrTd}>`;
    }

    db.Product.find((error, products) => {
        if (error) {
            console.log(`Failed finding documents. Reason: ${error}`);
        } else {
            let tableParts = [`<table><tr>${cellAlignedCenter('th', 'Image')}${cellAlignedCenter('th', 'Name')}${cellAlignedCenter('th', 'Price')}</tr>`];

            for (const product of products) {
                tableParts.push(`<tr><td><img src="images/${product.image}" width="200px" alt="${product.image}"/></td>${cellAlignedCenter('td', product.name)}${cellAlignedCenter('td', product.price + "$")}</tr>`);
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(createHtml('Products', tableParts.join('')));
        }
    });
}

mongoose.connect(`mongodb+srv://ServerTeam:QazWSX123@cluster0.xjg7v.mongodb.net/products_haim?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true, keepAliveInitialDelay: 300000 }) // Keep alive for 5 minutes
        .catch(error => console.log(`Failed connecting to MongoDB. Reason: ${error}`));
const db = mongoose.connection;

db.on('error', err => console.log(`MongoDB error: ${err}`));

db.once('open', async () => {
    console.log('Connected to MongoDB!');

    // This shitty mongoose doesn't find "Product".. It insists on searching for "products"...
    db.Product = mongoose.model('products', new mongoose.Schema({name: String, image: String, price: Number}));

    // Launch the server
    http.createServer(function (req, res) {
        console.log(`${req.method} ${req.url}`);

        let url = req.url.toLowerCase();
        if (url.startsWith('/images')) {
            getImage(req, res);
        } else {
            listProducts(req, res);
        }
    }).listen(1301);
    
    console.log('Server is listening on port 1301!');
});
