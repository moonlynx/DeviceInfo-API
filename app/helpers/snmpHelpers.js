const snmpConnector = require("../components/snmpConnector"),
      formatError = require("./errorHelpers"),
      snmp = require("net-snmp");

const SNMP_GET_ERROR = "SNMP error",
      UNKNOWN_OID_ERROR = "Unknown OID name";

function getOIDErrorValue(deviceIp, deviceOids, error) {

    console.error(
        "SNMP ERROR on Device: " + deviceIp + "\n" +
        "Device OIDs: " + deviceOids + "\n" +
        "Error: " + error
    );

    return SNMP_GET_ERROR;
}

function OIDResultObject(name, oid, value) {
    this.name = name,
    this.oid = oid,
    this.value = value
}

function getOIDName(dbOidsObject, oid) {
    for (key in dbOidsObject) {
        if (dbOidsObject[key] == oid) {
            return key;
        }
    }

    return UNKNOWN_OID_ERROR;
}

function getOIDsList(dbOidsObject) {
    let result = [];

    for (key in dbOidsObject) {
        result.push(dbOidsObject[key]);
    }

    return result;
}

function getSnmpResultObject(deviceObject) {

    return new Promise((resolve, reject) => {

        if (deviceObject.length != 1) {
            
            if (deviceObject.length > 1) {
                reject(formatError("getSnmpResultObject", "Too many devices with IP: " + deviceObject[0].ip));
            }

            resolve([]);
        }

        let session = snmpConnector.getSNMPSession(deviceObject[0].ip, deviceObject[0].comunity),
            oidsList = getOIDsList(deviceObject[0].oids),
            oidObjects = [];
                
        session.get(oidsList, function (error, varbinds) {

            if (error) {
                let oidErrorValue = getOIDErrorValue(deviceObject[0].ip, oidsList, error);

                oidsList.forEach(oid => {
                    let oidName = getOIDName(deviceObject[0].oids, oid);

                    oidObjects.push(new OIDResultObject(oidName, oid, oidErrorValue));
                });              
    
            } else {
                for (var i = 0; i < varbinds.length; i++) {
                    let oidName = getOIDName(deviceObject[0].oids, varbinds[i].oid);
                       
                    if (snmp.isVarbindError (varbinds[i])) {
                        oidObjects.push(new OIDResultObject(oidName, varbinds[i].oid, snmp.varbindError (varbinds[i])));
                        
                    } else {
                        oidObjects.push(new OIDResultObject(oidName, varbinds[i].oid, varbinds[i].value));
                    }
                }            
            }

            session.close();
            
            resolve(oidObjects);
        }); 
    });             
};

module.exports.getSnmpResultObject = getSnmpResultObject;