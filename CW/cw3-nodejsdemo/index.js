const http = require('http');
const fs = require("fs");

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    const fullUrl = request.headers.host + request.url;
    console.log(fullUrl);

    const urlObject = new URL(fullUrl);

    let content;
    if (request.url.startsWith('/hello')) {
        console.log('Hello');
        content = fs.readFileSync("bmiForm.html");
    } else {
        let width = urlObject.searchParams.get('width');
        let height = urlObject.searchParams.get('height');
        console.log(`width=${width}, height=${height}`);

        if ((width != null) && (height != null)) {
            content = `Area is: ${width * height}`;
        }
    }

    response.end(content);
})
    .listen(1300)