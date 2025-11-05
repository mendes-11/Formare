const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../model/user");
const Quadra = require("../model/quadra");

async function seedDB() {
  try {
    // 🔗 Conexão com o MongoDB
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("✅ Conectado ao MongoDB!");

    // 🧹 Limpa os dados antigos
    await User.deleteMany({});
    await Quadra.deleteMany({});
    console.log("🧹 Dados antigos removidos!");

    // 👤 Cria usuários de exemplo
    const users = await User.insertMany([
      {
        phone: "554199999999",
        nome: "Renato Mendes",
        edv: "12345",
        setor: "TI",
      },
      {
        phone: "554188888888",
        nome: "Ana Costa",
        edv: "67890",
        setor: "RH",
      },
    ]);

    console.log("👥 Usuários criados:", users.map(u => u.nome).join(", "));

    // 🏐 Cria quadras com horários (alguns reservados)
    const quadras = [
      {
        nome: "Futebol Society",
        horarios: [
          { horario: "08:00", reservado: false },
          { horario: "09:00", reservado: true, reservadoPor: { nome: users[0].nome, edv: users[0].edv, setor: users[0].setor } },
          { horario: "10:00", reservado: false },
          { horario: "11:00", reservado: true, reservadoPor: { nome: users[1].nome, edv: users[1].edv, setor: users[1].setor } },
          { horario: "12:00", reservado: false },
        ],
      },
      {
        nome: "Vôlei de Areia",
        horarios: [
          { horario: "08:00", reservado: true, reservadoPor: { nome: users[1].nome, edv: users[1].edv, setor: users[1].setor } },
          { horario: "09:00", reservado: false },
          { horario: "10:00", reservado: false },
          { horario: "11:00", reservado: true, reservadoPor: { nome: users[0].nome, edv: users[0].edv, setor: users[0].setor } },
          { horario: "12:00", reservado: false },
        ],
      },
      {
        nome: "Poli-esportiva",
        horarios: [
          { horario: "08:00", reservado: false },
          { horario: "09:00", reservado: false },
          { horario: "10:00", reservado: false },
          { horario: "11:00", reservado: true, reservadoPor: { nome: users[0].nome, edv: users[0].edv, setor: users[0].setor } },
          { horario: "12:00", reservado: true, reservadoPor: { nome: users[1].nome, edv: users[1].edv, setor: users[1].setor } },
        ],
      },
    ];

    await Quadra.insertMany(quadras);
    console.log("🏟️ Quadras e horários criados com sucesso!");

    // ✅ Finaliza conexão
    await mongoose.connection.close();
    console.log("🚀 Seed finalizado e conexão encerrada!");
  } catch (error) {
    console.error("❌ Erro ao popular o banco:", error);
    mongoose.connection.close();
  }
}

seedDB();
