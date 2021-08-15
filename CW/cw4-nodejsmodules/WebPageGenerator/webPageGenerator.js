const http = require('http');
const qs = require('querystring');
const fs = require("fs");
const path = require('path');

/**
 * Develop a simple web application that includes a form through which the user should fill three input elements with
 * the title (H1 title), the text (simple text that will be eventually placed under the title) and the filename.
 * The code running on the server side should create a new web page with the specified title and text.
 */

function createHtml(title, text) {
    return "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>" + title + "</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<h1>" + title + "</h1>\n" +
        "<p>\n" +
        text +
        "\n</p>\n" +
        "</body>\n" +
        "</html>";
}

function readBody(request, runWhenReady) {
    let body = '';

    request.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
        runWhenReady(body);
    });
}

http.createServer(function (request, response) {
    let statusCode = 200;
    const fullUrl = request.headers.host + request.url;
    console.log(fullUrl);


    let method = request.method.toUpperCase();
    console.log(`${method} ${request.url}`);

    if (request.url.toLowerCase().startsWith('/pages')) {
        let filePath = request.url.substring(1);
        fs.readFile(filePath, function (error, data) {
            console.log(`File read: ${filePath}`);

            if (error != null) {
                console.log("Error: " + error);

                response.writeHead(404, {'Content-Type': 'text/html'});
                response.end(createHtml('NOT FOUND', request.url + " is not found."));
            } else {
                response.writeHead(statusCode, {'Content-Type': 'text/html'});
                response.end(data);
            }
        });
    } else if (request.url.toLowerCase().startsWith('/generatewebpage')) {
        switch (method) {
            case "GET": {
                fs.readFile("generatorForm.html", function (error, data) {
                    if (error != null) {
                        console.log("Error: " + error);

                        response.writeHead(500, {'Content-Type': 'text/html'});
                        response.end(createHtml('SERVER ERROR', error));
                    } else {
                        response.writeHead(statusCode, {'Content-Type': 'text/html'});
                        response.end(data);
                    }
                });
                break;
            }
            case "POST": {
                readBody(request, function (body) {
                    let postBody = qs.parse(body);
                    let title = postBody.title;
                    let text = postBody.text;

                    let content = createHtml(title, text);

                    let filePath = `Pages${path.sep}${postBody.fileName.endsWith(".html") ? postBody.fileName : postBody.fileName + ".html"}`;
                    try {
                        fs.writeFile(filePath, content, function () {
                            console.log(`File wrote: ${filePath}`);
                        });
                    } catch (error) {
                        console.log(`Error while saving to file ${filePath}: ${error}`)
                    }

                    response.writeHead(statusCode, {'Content-Type': 'text/html'});
                    response.end(content);
                });
                break;
            }
        }
    } else {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end(createHtml('NOT FOUND', request.url + " is not found."));
    }

})
    .listen(1301)