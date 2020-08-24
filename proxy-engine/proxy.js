const httpProxy = require('http-proxy');
const proxyParameters = require('./proxy-parameter.js');

function proxy(configId) {

    let status = {
        id: configId,
        ports: {
            listen: null,
            target: null
        },
        open: false
    };

    this.proxy = null;

    this.open = function() {
        const parameters = proxyParameters.select(configId);
        console.log('Start proxy "' + configId + '"');

        // Setup parameters from Proxy Parameters to proxy library
        this.proxy = new httpProxy.createProxyServer({
            target: {
                protocol: parameters.target_protocol,
                host: parameters.target_host,
                port: parameters.target_port,
            },
            changeOrigin: true,
            secure: parameters.secure
        });

        this.proxy.on('error', () => {
            console.log('Proxy "' + configId + '" in error');
            status = {
                ...status,
                ports: {
                    listen: null,
                    target: null
                },
                open: false
            }
        });

        this.proxy.listen(parameters.port, () => {
            status = {
                ...status,
                ports: {
                    listen: parameters.port,
                    target: parameters.target_port
                },
                open: true
            }
        });
    }

    this.close = function() {
        console.log('Close proxy "' + configId + '"');
        this.proxy.close(function() {
            console.log('Proxy "' + configId + '" closed');
            status = {
                ...status,
                ports: {
                    listen: null,
                    target: null
                },
                open: false
            };
        });
    }

    this.isOpen = function() {
       return status.open;
    }

    this.openPort = function() {
       return status.ports.listen;
    }

    this.refresh = function() {
        let that = this;
        console.log('Refresh poxy connexion "' + configId + '"');
        this.proxy.close(() => {
            console.log('Proxy "' + configId + '" closed');
            that.open();
        });
    }

    this.getStatus = function() {
        return {date: Math.floor(Date.now()/1000), ...status };
    }
}

module.exports = proxy;

