const http = require('http');
const uaParser = require('ua-parser');

/**
 * 1. Develop a simple web application that returns a detailed list of all headers (name+value) the server side received together with the request.
 *
 * 2. Develop a simple web application that identifies the client and returns back a detailed report that lists the following:
 * a. The web browser (Chrome, IE, Firefox, Opera),
 * b. the device (Desktop/Laptop or Mobile Telephone)
 * c. the OS.
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

http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);

    let url = req.url.toLowerCase();
    if (url.startsWith('/headers')) {
        let headers = [];
        for (let i = 0; i < req.rawHeaders.length; i += 2) {
            headers.push(`${req.rawHeaders[i]} = ${req.rawHeaders[i + 1]}`);
        }

        // Sort the headers alphabetically and return it
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(createHtml('Headers', headers.sort().join('<br/>')));
    } else if (url.startsWith('/client')) {
        let browser = uaParser.parseUA(req.headers['user-agent']);
        let device = uaParser.parseDevice(req.headers['user-agent']);
        let os = uaParser.parseOS(req.headers['user-agent']);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(createHtml('Client Identification', `Web Browser: ${browser.family}<br/>Device: ${device.family}<br/>OS: ${os.family}`));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html'});
        res.end(createHtml('NOT FOUND', url + ' is not found.'));
    }

}).listen(1301)