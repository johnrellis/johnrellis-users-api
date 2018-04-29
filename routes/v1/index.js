'use strict';

const router = require('express').Router();

router.post('/users/', require('./controllers/user.controller.js').save);
router.get('/users/:id', require('./controllers/user.controller.js').get);


module.exports = router;