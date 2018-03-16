const   verifyIP = require("net").isIPv4,
        dbHelpers = require("./dbHelpers"),
        snmpHelpers = require("./snmpHelpers"),
        formatError = require("./errorHelpers");

function getOIDsValues(ip) {
            return  dbHelpers.getDeviceObject(ip)
                    .then(snmpHelpers.getSnmpResultObject)            
                    .then(result => {
                        return result;                 
                    })
                    .catch(error => {
                        throw formatError("getOIDsValues", error);
                    });
        }

module.exports.getQueryResponse = function(query) {
    if ("ip" in query) {
        if (verifyIP(query["ip"])) {
            return  getOIDsValues(query["ip"])
                    .then(result => {
                        return JSON.stringify(result);
                    })
                    .catch(error => {
                        throw formatError("getQueryResponse", error);
                    });

        } else {
            return Promise.reject("Wrong IP");
        }

    } else {
        return Promise.resolve("OK");
    }
}

module.exports.getDevicesResponse = function(query) {
    return  dbHelpers.getDevicesInfo()
            .then(result => {
                return JSON.stringify(result);
            })
            .catch(error => {
                throw formatError("getDevicesResponse", error);
            });
}