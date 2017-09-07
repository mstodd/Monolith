// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TokenForSharesTransactionSchema   = new Schema({
    buyerAddress: String,
    tokenCount: Number,
    sharesCount: Number
});

module.exports = mongoose.model('TokenForSharesTransaction', TokenForSharesTransactionSchema);