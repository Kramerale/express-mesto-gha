const badRequest = 400;
const notFound = 404;
const internalServerError = 500;

const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
  .then(cards => {
    return res.status(200).send(cards);
  })
  .catch(err => {
    return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
  })
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
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
  .then(card => {
    if(!card) {
      return res.status(notFound).send({message: 'Карточка с данным id не найдена'});
    }
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

const addLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
  .then(card => {
    if(!card) {
      return res.status(notFound).send({message: 'Карточка с данным id не найдена'});
    }
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

const deleteLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
  .then(card => {
    if(!card) {
      return res.status(notFound).send({message: 'Карточка с данным id не найдена'});
    }
    return res.status(200).send(card);
  })
  .catch(err => {
    if(err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(badRequest).send({message: 'Переданы некорректные данные'})
    } else {
      return res.status(internalServerError).send({message: 'Произошла ошибка на сервере'});
    }
  })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike
};