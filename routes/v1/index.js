'use strict';

const router = require('express').Router();

router.post('/users/', require('./controllers/user/user.create.js'));


module.exports = router;