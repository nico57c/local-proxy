const express = require('express');
const router = express.Router();
const factory = require('../proxy-engine/proxy-parameter.js');

router.get('/', function(req, res, next) {

  let proxyP = null;
  if(req.query.id !== undefined && isNaN(req.query.id)) {
    proxyP =  factory.select(req.query.id);
  } else {
    proxyP = factory.empty();
  }

  res.render('edit', {
    title: 'Edit',
    id: (req.query.id !== undefined ? req.query.id:null),
    proxyP: proxyP
  });
});

router.post('/', function(req, res, next) {

  let id = null;
  const body = req.body;
  if(req.body !== undefined) {
    id = factory.save(body);
  }

  res.render('edit', {
    title: 'Edit',
    proxyP: proxyP,
    id: id,
    success: id !== null
  });
});

module.exports = router;
