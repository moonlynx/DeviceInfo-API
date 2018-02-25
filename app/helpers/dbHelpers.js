const dbConnector = require("../components/dbConnector"),
      formatError = require("./errorHelpers"),
      config = require("../config");

function getDevicesCollection(serverInstance) {

    const db = serverInstance.db(config.dbName);
    
    return db.collection(config.cDevices);
}

function getFindResult(collection, query, projection) {

    return collection.find(query, {projection: projection});
}

function getDeviceObject(ip) {
    return  dbConnector.getServerInstance(config.username, config.password)
            .then(serverInstance => {

                const collection = getDevicesCollection(serverInstance),
                      projection = {_id: 0, ip: 1, oids: 1, comunity: 1};

                return  getFindResult(collection, {ip: ip}, projection).toArray()
                        .then(result => {
                            serverInstance.close();
                            return result;                           
                        })
                        .catch(error => {
                            throw formatError("getFindResult", error);
                        });
            })
            .catch(error => {
                throw formatError("getDeviceObject", error);
            });
}

module.exports.getDeviceObject = getDeviceObject;