const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');

const cardModel = require('../models/card');

const getCards = (req, res, next) => {
  cardModel.find({})
  .then((cards) => {
    return res.status(200).send(cards);
  })
  .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  cardModel.create({ name, link, owner })
  .then((card) => {
    return res.status(201).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  cardModel.findById(cardId)
  .orFail(() => {
    throw new NotFoundError('Карточка с данным id не найдена');
  })
  .then((card) => {
    if (card.owner.toString() === req.user._id) {
      cardModel.findByIdAndRemove(cardId)
      .then(() => {
        return res.status(200).send(card);
      });
    } else {
      throw new ForbiddenError('Нет доступа к удалению карточки');
    }
  })
  .catch(next);
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;

  cardModel.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail(new NotFoundError('Карточка с данным id не найдена'))
  .then((card) => {
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.message === 'Карточка с данным id не найдена') {
      next(new NotFoundError('Карточка с данным id не найдена'));
    } else {
      next(err);
    }
  });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;

  cardModel.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail(new NotFoundError('Карточка с данным id не найдена'))
  .then((card) => {
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.message === 'Карточка с данным id не найдена') {
      next(new NotFoundError('Карточка с данным id не найдена'));
    } else {
      next(err);
    }
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
