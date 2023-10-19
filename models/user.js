const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isEmail = require('validator/lib/isEmail');

const authError = require('../utils/AuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: email => isEmail(email),
      message: 'Поле "email" заполненно некорректно'
    }
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false
  },
},
{ versionKey: false },
{ useProjection: true }
);

userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({email}).select('+password')
  .then(user => {
    if(!user) {
      return Promise.reject(new authError('Неправильные почта или пароль'));
    }
    // пользователь найден
    // сравниваем переданный пароль и хеш из базы
    return bcrypt.compare(password, user.password)
    .then(matched => {
      if(!matched) {
        return Promise.reject(new authError('Неправильные почта или пароль'));
      }

      return user;
    })
  })
};

module.exports = mongoose.model('user', userSchema);