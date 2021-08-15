const http = require('http');
const qs = require('querystring');

/**
 * Develop a simple web application that provides the user with a form that displays the multiplication table on
 * screen and allows the user to enters two numbers (rows and columns).
 * When pressing 'submit' the server side returns the very same web page... just with a multiplication table that
 * its number of rows and its numbers of columns are the requested ones.
 */

function createHtml(rows, columns) {
    let tableElement = ["<table>"];

    for (let i = 1; i <= rows; i++) {
        tableElement.push("<tr>")
        for (let j = 1; j <= columns; j++) {
            tableElement.push((i === 1 || j === 1 ? "<th" : "<td") + " style=\"text-align:center\">");
            tableElement.push((i * j).toString());
            tableElement.push(i === 1 || j === 1 ? "</th>" : "</td>");
        }

        tableElement.push("</tr>");
    }

    tableElement.push("</table>");

    return "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>Multiplication Table</title>\n" +
        "    <style>\n" +
        "        td, th\n" +
        "        {\n" +
        "            padding:6px 6px;\n" +
        "        }\n" +
        "    </style>" +
        "</head>\n" +
        "<body>\n" +
        "<h3>Multiplication Table</h3>\n" +
        "<p>\n" +
        tableElement.join("") +
        "</p>" +
        "<p>" +
        "    <!-- GET will send the inputs as QueryString. POST will send them as BODY. -->\n" +
        "    <form action=\"http://localhost:1301/multiplicationTable\" method=\"post\">\n" +
        "        <label>Rows:\n" +
        "            <input type=\"number\" name=\"rows\"/>\n" +
        "        </label><br/>\n" +
        "        <label>Columns:\n" +
        "            <input type=\"number\" name=\"columns\"/>\n" +
        "        </label><br/>\n" +
        "        <input type=\"submit\"/>\n" +
        "    </form>\n" +
        "</p>\n" +
        "</body>\n" +
        "</html>";
}

http.createServer(function (request, response) {
    let statusCode = 200;
    const fullUrl = request.headers.host + request.url;
    console.log(fullUrl);

    if (request.url.startsWith('/multiplicationTable')) {
        console.log('/multiplicationTable');
        let rows = 10;
        let columns = 10;

        if (request.method.toUpperCase() === "POST") {
            let body = '';

            request.on('data', function (data) {
                body += data;

                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });

            request.on('end', function () {
                let postBody = qs.parse(body);
                rows = postBody.rows;
                columns = postBody.columns;

                let content = createHtml(rows, columns);
                response.writeHead(statusCode, {'Content-Type': 'text/html'});
                response.end(content);
            });
        } else {
            let content = createHtml(rows, columns);
            response.writeHead(statusCode, {'Content-Type': 'text/html'});
            response.end(content);
        }
    }

})
    .listen(1301)