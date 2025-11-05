const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  nome: String,
  edv: String,
  setor: String,
  step: { type: String, default: "inicio" },
  selectedQuadra: String,
  pendingHorarioIndex: Number 
});

module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   phone: { type: String, required: true, unique: true },
//   nome: { type: String },
//   edv: { type: String },
//   setor: { type: String },
//   etapaCadastro: { type: Number, default: 1 },
//   ultimaQuadraSelecionada: { type: mongoose.Schema.Types.ObjectId, ref: "Quadra", default: null }
// });

// module.exports = mongoose.model("User", userSchema);


