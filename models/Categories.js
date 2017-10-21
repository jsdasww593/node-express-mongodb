const mongoose = require('mongoose');
const categoriesSchema = require('../schemes/categories');

module.exports = mongoose.model('Category', categoriesSchema);