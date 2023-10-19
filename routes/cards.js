const router = require('express').Router();
const {getCards, createCard, deleteCard, addLike, deleteLike} = require('../controllers/cards');
const {createCardValidation, cardIdValidation} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.put('/:cardId/likes', cardIdValidation, addLike);
router.delete('/:cardId/likes', cardIdValidation, deleteLike);

module.exports = router;