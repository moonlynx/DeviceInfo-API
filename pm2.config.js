module.exports = {
  apps : [{
    name   : "DeviceInfo-API",
    script : "./app/server.js",
        
    exec_mode : "cluster",
    instances : "2",

    log_date_format: "DD-MM-YYYY HH:mm:ss",
    error_file: "./logs/server_error.log",
    out_file: "./logs/server.log",
    merge_logs: true
  }]
}
