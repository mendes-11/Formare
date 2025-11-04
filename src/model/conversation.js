const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  message: { type: String },
  sender: { type: String, enum: ["user", "bot"] },
  step: { type: String, default: "waiting_user_info" },
  userInfo: {
    name: String,
    edv: String,
    sector: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", conversationSchema);
