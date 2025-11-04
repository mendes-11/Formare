const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  telefone: { type: String, required: true },
  quadraId: { type: mongoose.Schema.Types.ObjectId, ref: "Quadra", required: true },
  horarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Horario", required: true },
  dataReserva: { type: String, required: true }, // formato: "2025-11-03"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reserva", reservaSchema);
