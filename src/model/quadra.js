// const mongoose = require("mongoose");

// const quadraSchema = new mongoose.Schema({
//   nome: { type: String, required: true },
//   horarios: [
//     {
//       hora: String,
//       disponivel: { type: Boolean, default: true },
//       reservadoPor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null
//       }
//     },
//   ],
// });

// module.exports = mongoose.model("Quadra", quadraSchema);



const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema({
  horario: String,
  reservado: { type: Boolean, default: false },
  reservadoPor: {
    nome: String,
    edv: String,
    setor: String
  }
});

const quadraSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  horarios: [horarioSchema]
});

module.exports = mongoose.model("Quadra", quadraSchema);
