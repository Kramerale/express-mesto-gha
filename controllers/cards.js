const badRequestError = require('../utils/BadRequestError');
const notFoundError = require('../utils/NotFoundError');
const forbiddenError = require('../utils/ForbiddenError');

const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
  .then(cards => {
    return res.status(200).send(cards);
  })
  .catch(next);
};

const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;

  cardModel.create({name, link, owner})
  .then(card => {
    return res.status(201).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const deleteCard = (req, res) => {
  const {cardId} = req.params;

  cardModel.findById(cardId)
  .then(card => {
    if(!card) {
      throw new notFoundError('Карточка с данным id не найдена');
    }

    if(card.owner.toString() === req.user._id) {
      cardModel.findByIdAndRemove(cardId)
      .then(() => {
        return res.status(200).send(card);
      })
    } else {
      throw new forbiddenError('Нет доступа к удалению карточки');
    }
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const addLike = (req, res) => {
  const {cardId} = req.params;

  cardModel.findByIdAndUpdate(
    cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
  .then(card => {
    if(!card) {
      throw new notFoundError('Карточка с данным id не найдена');
    }
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

const deleteLike = (req, res) => {
  const {cardId} = req.params;

  cardModel.findByIdAndUpdate(
    cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
  .then(card => {
    if(!card) {
      throw new notFoundError('Карточка с данным id не найдена');
    }
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
  })
  .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike
};