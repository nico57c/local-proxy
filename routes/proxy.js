const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const proxyParameter = require('../proxy-engine/proxy-parameter');
const proxyManager = require('../proxy-engine/proxy-manager');

function _start_stop(id, res, startStop) {
    if(id !== undefined && uuid.validate(id) && uuid.version(id) === 4) {

        const status = (startStop === true? proxyManager.start(id): proxyManager.stop(id) );

        if(status !== undefined){
            res.send({...status, success: true});
        } else {
            res.status(404).send({
                error: 'No status found for this id',
                success: false
            });
        }
    } else {
        res.status(400).send({
            error: 'Bad Argument id is not an UUID v4',
            success: false
        });
    }
}

router.get('/status', function(req, res, next) {

    if(req.query.id !== undefined && uuid.validate(req.query.id) && uuid.version(req.query.id) === 4){
        const status = proxyManager.getStatus(req.query.id);
        if(status !== undefined){
            res.send({...status, success: true});
        } else {
            res.status(404).send({
                error: 'No status found for this id',
                success: false
            });
        }
    } else {
        res.status(400).send({
            error: 'Bad Argument id is not an UUID v4',
            success: false
        });
    }
});

router.get('/start', function(req, res, next) {
    _start_stop(req.query.id, res, true);
});

router.get('/stop', function(req, res, next) {
    _start_stop(req.query.id, res, false);
});


module.exports = router;
