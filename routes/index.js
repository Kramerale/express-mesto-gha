const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const notFound = 404;

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res.status(notFound).send({message: `По адресу ${req.path} ничего не найдено`});
});

module.exports = router;