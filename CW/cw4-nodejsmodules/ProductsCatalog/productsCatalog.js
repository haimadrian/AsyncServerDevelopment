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
            console.error("Error: " + error);

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
            console.error(`Failed finding documents. Reason: ${error}`);
        } else {
            let tableParts = [`<table><tr>${cellAlignedCenter('th', 'Image')}${cellAlignedCenter('th', 'Name')}${cellAlignedCenter('th', 'Price')}</tr>`];

            for (const product of products) {
                product.printDetails();
                tableParts.push(`<tr><td><img src="images/${product.image}" width="200px" alt="${product.image}"/></td>${cellAlignedCenter('td', product.name)}${cellAlignedCenter('td', product.price + "$")}</tr>`);
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(createHtml('Products', tableParts.join('')));
        }
    });
}

const mongoDbHost = process.env.EXPENSE_DB_HOST;
const mongoDbUser = process.env.EXPENSE_DB_USERNAME;
const mongoDbPwd = process.env.EXPENSE_DB_PWD;
mongoose.connect('mongodb+srv://' + mongoDbUser + ':' + mongoDbPwd + '@' + mongoDbHost + '/user_management?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true, keepAliveInitialDelay: 300000 }) // Keep alive for 5 minutes
        .catch(error => console.log(`Failed connecting to MongoDB. Reason: ${error}`));
const connection = mongoose.connection;
const db = {};

connection.on('error', console.error.bind(console, 'MongoDB error: '));

connection.once('open', () => {
    console.log('Connected to MongoDB!');

    let productsSchema = new mongoose.Schema({
        name: String,
        image: String,
        price: Number
    });

    // Lambda does not work here. this refers to the parent scope's this
    //productsSchema.methods.printDetails = () => console.log(`Name: ${this.name}, Price: ${this.price}$`);
    productsSchema.methods.printDetails = function() {
        console.log(`Name: ${this.name}, Price: ${this.price}$`);
    }

    // This returns a constructor function, sow we can do new db.Product()
    db.Product = mongoose.model('products', productsSchema);

    // Launch the server
    let server = http.createServer(function (req, res) {
        console.log(`${req.method} ${req.url}`);

        let url = req.url.toLowerCase();
        if (url.startsWith('/images') || url.startsWith('/favicon.ico')) {
            getImage(req, res);
        } else {
            listProducts(req, res);
        }
    });

    server.on('listening', () => {
        console.info('Server is listening on port 1301');
    });

    server.listen(1301);
});
