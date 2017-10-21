const mongoose = require('mongoose');

/**
 * 用户的表结构
 */
module.exports = new mongoose.Schema({
    
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }

});