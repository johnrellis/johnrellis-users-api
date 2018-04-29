'use strict';

/**
 * Simple definition of user api routes, calls controller functions, should not contain implementation
 */

const router = require('express').Router();

router.post('/users/', require('./controllers/user.controller.js').save);
router.get('/users/:id', require('./controllers/user.controller.js').get);
router.delete('/users/:id', require('./controllers/user.controller.js').delete);


module.exports = router;