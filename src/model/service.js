// const mongoose = require('mongoose');

// // Subschemas para quadras e churrasqueiras
// const subServiceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type_reservation: { type: String, enum: ['por_hora','dia_inteiro'], required: true },
//   horarios_funcionamento: { 
//     segunda: [String],
//     terca: [String],
//     quarta: [String],
//     quinta: [String],
//     sexta: [String],
//     sabado: [String],
//     domingo: [String]
//   }
// });

// // Schema principal
// const serviceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, enum: ['Quadra','Churrasqueira'], required: true },
//   subServices: [subServiceSchema],
//   active: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const servicesPreloaded = [
//   {
//     name: "Reserva de Quadras",
//     category: "Quadra",
//     subServices: [
//       { 
//         name: "Poli Esportiva", 
//         type_reservation: "por_hora", 
//         horarios_funcionamento: {
//           segunda: ["18:00","19:00","20:00"],
//           terca: ["18:00","19:00","20:00"],
//           quarta: ["18:00","19:00","20:00"],
//           quinta: ["18:00","19:00","20:00"],
//           sexta: ["18:00","19:00","20:00"],
//           sabado: ["08:00","09:00","10:00"],
//           domingo: ["08:00","09:00","10:00"]
//         } 
//       },
//       { 
//         name: "Quadra de Areia", 
//         type_reservation: "por_hora", 
//         horarios_funcionamento: {
//           segunda: ["18:00","19:00"],
//           terca: ["18:00","19:00"],
//           quarta: ["18:00","19:00"],
//           quinta: ["18:00","19:00"],
//           sexta: ["18:00","19:00"],
//           sabado: ["08:00","09:00"],
//           domingo: ["08:00","09:00"]
//         } 
//       }
//       // ...adicione as outras quadras aqui
//     ]
//   },
//   {
//     name: "Churrasqueiras",
//     category: "Churrasqueira",
//     subServices: [
//       { name: "Tingui Passauna", type_reservation: "dia_inteiro", horarios_funcionamento: {} },
//       { name: "Barigui", type_reservation: "dia_inteiro", horarios_funcionamento: {} },
//       { name: "Jardim Botânico", type_reservation: "dia_inteiro", horarios_funcionamento: {} }
//       // ...adicione as outras churrasqueiras aqui
//     ]
//   }
// ];

// const ServiceModel = mongoose.model('Service', serviceSchema);
// module.exports = { ServiceModel, servicesPreloaded };
