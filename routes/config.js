const express = require('express');
const router = express.Router();
const proxyParameter = require('../proxy-engine/proxy-parameter');
const uuid = require('uuid');

router.get('/', function(req, res, next) {

  let data = null;
  if(req.query.id !== undefined && isNaN(req.query.id)) {
    data =  proxyParameter.select(req.query.id);
  } else {
    data = proxyParameter.empty();
  }

  res.render('config-form', {
    title: 'config-form',
    id: (req.query.id !== undefined ? req.query.id:null),
    data: data
  });

});

router.post('/', function(req, res, next) {

  let id = null;
  const body = req.body;

  if(body !== undefined) {
    delete body.id;
    id = proxyParameter.save(body);
  }

  res.send({
    id: id,
    success: id !== null
  });

});

router.put('/', function( req, res, next) {

  let id = null;
  const body = req.body;
  const reqId = req.query.id;

  if(body !== undefined && reqId !== undefined) {
    if(uuid.validate(reqId) && uuid.version(reqId) === 4) {
      body.id = '' + reqId;
      id = proxyParameter.save(body);
    }
  }

  res.send({
    id: id,
    success: id !== null
  });
})

router.delete('/', function(req, res, next) {
  let success = false;
  const reqId = req.query.id;

  if(reqId !== undefined) {
    if(uuid.validate(reqId) && uuid.version(reqId) === 4) {
      success = proxyParameter.delete(reqId);
    }
  }

  res.send({
    success: success
  });
});

module.exports = router;
