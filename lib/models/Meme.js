const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  top: {
    type: String,
    require: true
  }
});