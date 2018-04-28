'use strict';

const router = require('express').Router();

router.post('/users/', require('./controllers/user.controller.js').save);


module.exports = router;