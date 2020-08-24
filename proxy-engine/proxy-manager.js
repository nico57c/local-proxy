const Proxy = require('./proxy.js');
const ProxyParameter = require('./proxy-parameter.js');

function proxyManager() {

    let proxies = {};

    this.startAll = function() {
       ProxyParameter.selectAllIds().forEach(configId => {
            proxies[configId] = new Proxy(configId);
            proxies[configId].open();
       });
    }

    this.start = function(configId) {
        if(ProxyParameter.exists(configId) === false) {
            return undefined;
        }

        if(proxies[configId] === undefined || proxies[configId].isOpen() === false) {
            proxies[configId] = new Proxy(configId);
            proxies[configId].open();
        }
        return this.getStatus(configId);
    }

    this.stop = function(configId) {
        if(ProxyParameter.exists(configId) === false) {
            return undefined;
        }

        if(proxies[configId] !== undefined || proxies[configId].isOpen() === true) {
            proxies[configId].close();
        }
        return this.getStatus(configId);
    }

    this.restart = function(configId) {
        if(ProxyParameter.exists(configId) === false) {
            return undefined;
        }

        if(proxies[configId] !== undefined) {
            proxies[configId].refresh();
        }
        return this.getStatus(configId);
    }

    this.closeAll = function() {
        proxies.forEach(item => item.close());
    }

    this.getAllStatus = function() {
        return proxies.map(proxy => proxy.getStatus());
    }

    this.getStatus = function(configId) {
        return proxies[configId] === undefined? undefined: proxies[configId].getStatus();
    }

    this.isOpen = function(configId) {
        return proxies[configId] === undefined? false: proxies[configId].isOpen();
    }
}


module.exports = new proxyManager();
