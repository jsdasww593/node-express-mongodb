const mongoose = require('mongoose');
const usersSchema = require('../schemes/users');

module.exports = mongoose.model('User', usersSchema);