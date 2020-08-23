const uuid = require('uuid');

const dbJ = require('node-json-db');
const {Config} = require('node-json-db/dist/lib/JsonDBConfig');

const db = new dbJ.JsonDB(new Config("proxy-parameters", false, false, '/'));

function proxyParameterFactory() {

    this.dataValidation = function(body) {
        return body.name !== undefined &&
        body.port !== undefined &&
        body.target_protocol !== undefined &&
        ( body.target_protocol === 'https' ||  body.target_protocol === 'http' ) &&
        body.target_host !== undefined &&
        body.target_port !== undefined &&
        body.secure !== undefined &&
        ( body.secure === true || body.secure === false );
    }

    this.escapeData = function(body) {
       return {
           id: body.id,
           name: escape(body.name),
           port: parseInt(body.port) <= 0? 0: parseInt(body.port),
           target_protocol: body.target_protocol === 'https'? 'https': 'http',
           target_host: escape(body.target_host),
           target_port: parseInt(body.target_port) <= 0? 0: parseInt(body.target_port),
           secure: body.secure === true
       };
    }

    this.save = function save(body) {
        if(this.dataValidation(body)) {
            let id = null;
            if(body.id === undefined) {
                id = uuid.v4();
                console.log('New id : ', id);
            } else {
                if(uuid.validate(body.id) && uuid.version(body.id) === 4) {
                    id = '' + body.id;
                    delete body.id;
                    console.log('Detected id : ', id);
                } else {
                    id = uuid.v4();
                    console.log('Undetected id : ', id);
                }
            }

            body = this.escapeData(body);
            body.id = id;

            db.push('/id/' + id, body);
            db.push('/port/' + body.port, {
                id: id,
                target_port: body.target_port
            });
            db.save(true);
            return id;
        } else {
            console.log('Error detected', body);
            return null;
        }
    };

    this.delete = function(id) {
        const body = db.getData('/id/' + id);
        if(body !== undefined) {
            db.delete('/id/' + id);
            db.delete( '/port/' + body.port);
            db.save(true);
            return true;
        } else {
            return false;
        }
    }

    this.exists = function(id) {
        return db.getData('/id/' + id) !== undefined;
    }

    this.select = function(id) {
        return db.getData('/id/' + id);
    };

    this.selectAll = function() {
        return db.getData('/');
    }

    this.selectAllIds = function() {
        return db.getIndex('/', 'id');
    }

    this.empty = function() {
        return {
            id: null,
            name: null,
            port: null,
            target_protocol: null,
            target_host: null,
            target_port: null,
            secure: false
        }
    };
}


module.exports = new proxyParameterFactory();
