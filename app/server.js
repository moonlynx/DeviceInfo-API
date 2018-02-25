const   http = require("http"),
        url = require("url"),
        verifyIP = require("net").isIPv4,
        serverHelpers = require("./helpers/serverHelpers"),
        config = require("./config");

const   SERVER = http.createServer();

function serverCB(req, res) {
    let str = url.parse(req.url, true),
        query = str.query,
        pathname = str.pathname;

    if ((pathname == "/query") && ("ip" in query) && (verifyIP(query["ip"]))) {
        
        serverHelpers.getOIDsValues(query["ip"])
        .then(result => {
            res.end(JSON.stringify(result));
        })
        .catch(error => {
            console.error(error);
            res.end("ERROR");
        });

    } else {
        res.end("OK");
    }    
}

SERVER.on("request", serverCB);

SERVER.listen({
    host: config.httpHost,
    port: config.httpPort
});