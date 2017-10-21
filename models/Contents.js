const mongoose = require('mongoose');
const contentsSchema = require('../schemes/contents');

module.exports = mongoose.model('Content', contentsSchema);