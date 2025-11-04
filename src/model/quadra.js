const mongoose = require("mongoose");

const quadraSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Quadra", quadraSchema);
