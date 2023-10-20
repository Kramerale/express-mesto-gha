const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const notFoundError = require('../utils/NotFoundError');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new notFoundError(`По адресу ${req.path} ничего не найдено`));
});

module.exports = router;