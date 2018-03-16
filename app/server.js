const   http = require("http"),
        url = require("url"),
        serverHelpers = require("./helpers/serverHelpers"),
        formatError = require("./helpers/errorHelpers"),
        config = require("./config");

const   SERVER = http.createServer();

function serverCB(req, res) {
    let str = url.parse(req.url, true),
        query = str.query,
        pathname = str.pathname;

    switch (pathname) {
        case "/query": 
            serverHelpers.getQueryResponse(query)
            .then(result => {
                res.end(result);
            })
            .catch(error => {
                console.error(formatError("/query", error));
                res.end("ERROR");
            });
            break;

        case "/devices": 
            serverHelpers.getDevicesResponse(query)
            .then(result => {
                res.end(result);
            })
            .catch(error => {
                console.error(formatError("/devices", error));
                res.end("ERROR");
            });
            break;

        default:
            res.end("OK");
            break;
    }
}

SERVER.on("request", serverCB);

SERVER.listen({
    host: config.httpHost,
    port: config.httpPort
});