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
                      query = {ip: ip},
                      projection = {_id: 0, ip: 1, oids: 1, comunity: 1};

                return  getFindResult(collection, query, projection).toArray()
                        .then(result => {
                            serverInstance.close();
                            return result;                           
                        })
                        .catch(error => {
                            serverInstance.close();
                            throw formatError("getFindResult", error);
                        });
            })
            .catch(error => {
                throw formatError("getDeviceObject", error);
            });
}

function getDevicesInfo() {
    return  dbConnector.getServerInstance(config.username, config.password)
            .then(serverInstance => {

                const collection = getDevicesCollection(serverInstance),
                      query = {},
                      projection = {_id: 0};

                return  getFindResult(collection, query, projection).toArray()
                        .then(result => {
                            serverInstance.close();
                            return result;                           
                        })
                        .catch(error => {
                            serverInstance.close();
                            throw formatError("getFindResult", error);
                        });
            })
            .catch(error => {
                throw formatError("getDevicesInfo", error);
            });
}

module.exports.getDeviceObject = getDeviceObject;
module.exports.getDevicesInfo = getDevicesInfo;