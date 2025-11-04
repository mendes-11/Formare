const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema({
  quadraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quadra",
    required: true
  },
  data: {
    type: String, // formato: "2025-11-03"
    required: true
  },
  hora: {
    type: String, // exemplo: "08:30"
    required: true
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Horario", horarioSchema);
