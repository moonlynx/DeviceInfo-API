const   dbHelpers = require("./dbHelpers"),
        snmpHelpers = require("./snmpHelpers"),
        formatError = require("./errorHelpers");

module.exports.getOIDsValues = function(ip) {
    return  dbHelpers.getDeviceObject(ip)
            .then(snmpHelpers.getSnmpResultObject)            
            .then(result => {
                return result;                 
            })
            .catch(error => {
                throw formatError("getOIDsValues", error);
            });
}