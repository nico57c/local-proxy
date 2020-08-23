const express = require('express');
const router = express.Router();
const proxyParameter = require('../proxy-engine/proxy-parameter');
const proxyManager = require('../proxy-engine/proxy-manager');

router.get('/', function(req, res, next) {
  const data = proxyParameter.selectAll()

  res.render('index', {
    title: 'Local Proxy',
    data: data.id !== undefined? data.id : {},
    proxyManager: proxyManager
  });
});

module.exports = router;
