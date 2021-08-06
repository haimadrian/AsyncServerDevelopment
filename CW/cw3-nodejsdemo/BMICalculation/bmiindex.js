const http = require('http');
const fs = require("fs");

http.createServer(function (request, response) {
    let statusCode = 200;
    const fullUrl = request.headers.host + request.url;
    console.log(fullUrl);

    const urlObject = new URL(fullUrl);

    let content;
    if (request.url.startsWith('/bmi')) {
        console.log('/bmi');
        content = fs.readFileSync("bmiForm.html");
    } else if (request.url.startsWith('/calc')) {
        console.log('/calc');

        let weight = urlObject.searchParams.get('weight');
        let height = urlObject.searchParams.get('height');
        console.log(`weight=${weight}, height=${height}`);

        if ((weight == null) || (height == null) || (weight === '') || (height === '')) {
            statusCode = 400;
            content = 'Please fill-in weight and height.';
        } else {
            content = `BMI is: ${height === 0 ? Number.POSITIVE_INFINITY : weight / Math.pow(height, 2) * 10000}`;
        }
    }

    response.writeHead(statusCode, {'Content-Type': 'text/html'});
    response.end(content);
})
    .listen(1301)