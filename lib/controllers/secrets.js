const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const secret = await Secret.insert(req.body);
    res.send(secret);
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
