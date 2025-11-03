const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const WhatsAppController = require("./src/controller/whatsappController");
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}
connectToDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

require("./startup/routes")(app);

const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log("Escaneie o QR Code para conectar o WhatsApp");
});

client.on('ready', () => {
  console.log('WhatsApp conectado...');
});


client.on('message', async msg => {
  try {
    const req = {
      body: {
        phone: msg.from,   
        message: msg.body  
      }
    };

    const res = {
      status: (code) => ({
        json: (obj) => {
          console.log("Resposta do bot:", obj);
          client.sendMessage(msg.from, obj.message);
        },
        send: (obj) => {
          console.log("Resposta do bot:", obj);
          client.sendMessage(msg.from, obj.message);
        }
      })
    };

    await WhatsAppController.receiveMessage(req, res);

  } catch (err) {
    console.error("Erro ao processar mensagem:", err);
  }
});

client.initialize();

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Servidor rodando: http://localhost:${port}/`));
