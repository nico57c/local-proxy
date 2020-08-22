const Proxy = require('proxy');
const dbJ = require('node-json-db');
const dbConfig = require('node-json-db/dist/lib/JsonDBConfig');

function startEngine() {

    const db = new dbJ.JsonDB(new dbConfig.Config("proxy-parameters", true, false, '/'));
    const data = db.getData("/");

    this.proxies = [];

    this.run = function() {
        this.proxies = data.map(item => new Proxy(item)).toArray();
        this.proxies.forEach(proxy => proxy.run());
    }
}


module.exports = startEngine;
