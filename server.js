var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({
    limit: myLimit
}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var url = req.url.substr(1);
        var requestVar = {
            url: url,
            method: req.method,
            json: req.body
        };
        if (req.header('Authorization')) {
            requestVar.headers = {
                'Authorization': req.header('Authorization'),
                'Content-Type': 'application/json'
            }
        } else {
            requestVar.headers = {
                'Content-Type': 'application/json'
            }
        }
        request(requestVar,
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
                //                console.log(body);
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});