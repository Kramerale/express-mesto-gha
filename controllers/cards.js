const badRequestError = require('../utils/BadRequestError');
const notFoundError = require('../utils/NotFoundError');
const forbiddenError = require('../utils/ForbiddenError');

const cardModel = require('../models/card');

const getCards = (req, res, next) => {
  cardModel.find({})
  .then(cards => {
    return res.status(200).send(cards);
  })
  .catch(next);
};

const createCard = (req, res, next) => {
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

const deleteCard = (req, res, next) => {
  const {cardId} = req.params;

  cardModel.findById(cardId)
  .orFail(new notFoundError('Карточка с данным id не найдена'))
  .then(card => {
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
    if(err.message === 'Карточка с данным id не найдена') {
      throw new notFoundError('Карточка с данным id не найдена');
    }
  })
  .catch(next);
};

const addLike = (req, res, next) => {
  const {cardId} = req.params;

  cardModel.findByIdAndUpdate(
    cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
  .orFail(new notFoundError('Карточка с данным id не найдена'))
  .then(card => {
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
    if(err.message === 'Карточка с данным id не найдена') {
      throw new notFoundError('Карточка с данным id не найдена');
    }
  })
  .catch(next);
};

const deleteLike = (req, res, next) => {
  const {cardId} = req.params;

  cardModel.findByIdAndUpdate(
    cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
  .orFail(new notFoundError('Карточка с данным id не найдена'))
  .then(card => {
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      throw new badRequestError('Переданы некорректные данные');
    }
    if(err.message === 'Карточка с данным id не найдена') {
      throw new notFoundError('Карточка с данным id не найдена');
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