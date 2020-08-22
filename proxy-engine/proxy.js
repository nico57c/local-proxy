const httpProxy = require('http-proxy');

function proxyEngine(proxyParameters) {

    this.parameters = proxyParameters;

    this.run = function() {

        console.log('Start proxy of "' + this.parameters.name + '"');

        // Setup parameters from Proxy Parameters to proxy library
        this.httpProxy = httpProxy.createProxyServer({
            target: {
                protocol: this.parameters.target.protocol,
                host: this.parameters.target.host,
                port: this.parameters.target.port,
            },
            changeOrigin: true,
            secure: false,
        }).listen(this.parameters.port);

    };

    this.close = function() {
        let that = this;
        console.log('close proxy of ' + this.parameters.name);
        this.httpProxy.close(function() {
            console.log('Proxy "' + that.parameters.name + '" closed');
        });
    };

}

module.exports = proxyEngine;

