const express = require('express');
const router = express.Router();

const dbJ = require('node-json-db');
const dbconfig = require('node-json-db/dist/lib/JsonDBConfig');

const db = new dbJ.JsonDB(new dbconfig.Config("proxy-parameters", true, false, '/'));
const data = db.getData("/");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Http to https proxy',
    data: data
  });
});

module.exports = router;
