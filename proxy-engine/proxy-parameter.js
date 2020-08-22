const uuid = require('uuid');

const dbJ = require('node-json-db');
const {Config} = require('node-json-db/dist/lib/JsonDBConfig');

const db = new dbJ.JsonDB(new Config("proxy-parameters", true, false, '/'));

function proxyParameterFactory() {

    this.save = function save(body) {
        if(body.name !== undefined &&
            body.port !== undefined &&
            body.target.protocol !== undefined &&
            body.target.host !== undefined &&
            body.target.port !== undefined &&
            body.secure !== undefined
        ) {
            const id = uuid.v4();
            body.id = id;
            db.push('/id/' + id, body);
            db.save(true);
            return id;
        } else {
         return null;
        }
    };

    this.select = function(id) {
        return db.getData("/id/" + id);
    };

    this.empty = function() {
        return {
            id: null,
            name: null,
            port: null,
            target: {
                protocol: null,
                host: null,
                port: null
            },
            secure: false
        }
    };
}


module.exports = new proxyParameterFactory();
