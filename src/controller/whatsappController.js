const User = require("../model/user");
const Quadra = require("../model/quadra");

// Helper: valida EDV com exatamente 8 dígitos numéricos
function isValidEdv(edv) {
  return /^\d{8}$/.test(edv.trim());
}

exports.receiveMessage = async (req, res) => {
  const { phone, message } = req.body;
  const msg = (message || "").trim();

  // Busca ou cria usuário
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, step: "pedir_nome" });
    return res.status(200).json({
      message: "👋 Olá! Seja bem-vindo!\nAntes de continuar, por favor, me informe seu *nome completo*:"
    });
  }

  // -------------------- CADASTRO / VALIDAÇÕES --------------------
  if (user.step === "pedir_nome") {
    if (!msg) return res.status(200).json({ message: "Por favor, informe seu *nome completo*:" });
    await User.updateOne({ phone }, { nome: msg, step: "pedir_edv" });
    return res.status(200).json({ message: `Perfeito, *${msg}*! 😄\nAgora me informe seu *EDV*:` });
  }

  if (user.step === "pedir_edv") {
    if (!isValidEdv(msg)) return res.status(200).json({ message: "EDV inválido. O EDV deve ter exatamente *8 dígitos numéricos*. Tente novamente:" });
    await User.updateOne({ phone }, { edv: msg, step: "pedir_setor" });
    return res.status(200).json({ message: "Ótimo! 👍\nPor fim, digite o *setor* em que você trabalha:" });
  }

  if (user.step === "pedir_setor") {
    if (!msg) return res.status(200).json({ message: "Por favor, informe seu *setor*:" });
    await User.updateOne({ phone }, { setor: msg, step: "confirmar_dados" });
    const u = await User.findOne({ phone });
    return res.status(200).json({
      message:
        `🔎 *Confirme seus dados:*\n\n` +
        `👤 Nome: *${u.nome}*\n🆔 EDV: *${u.edv}*\n🏢 Setor: *${u.setor}*\n\nDeseja confirmar?\n\n1️⃣ Sim\n2️⃣ Não`
    });
  }

  // Confirmação de dados
  if (user.step === "confirmar_dados") {
    if (msg === "1") {
      await User.updateOne({ phone }, { step: "menu" });
      return res.status(200).json({
        message: "✅ Informações recebidas!\n\nEscolha uma opção:\n\n1️⃣ Quadras\n2️⃣ Churrasqueiras"
      });
    }
    if (msg === "2") {
      await User.updateOne({ phone }, { step: "escolher_campo_edicao" });
      return res.status(200).json({
        message: "👍 OK — qual campo você quer editar?\n\n1️⃣ Nome\n2️⃣ EDV\n3️⃣ Setor\n\nEnvie o número correspondente."
      });
    }
    return res.status(200).json({ message: "Digite *1* para confirmar ou *2* para editar os dados." });
  }

  // Escolher campo para editar
  if (user.step === "escolher_campo_edicao") {
    if (msg === "1") {
      await User.updateOne({ phone }, { step: "editar_nome" });
      return res.status(200).json({ message: "✏️ Ok — envie o *novo nome completo*:" });
    }
    if (msg === "2") {
      await User.updateOne({ phone }, { step: "editar_edv" });
      return res.status(200).json({ message: "✏️ Ok — envie o *novo EDV* (8 dígitos):" });
    }
    if (msg === "3") {
      await User.updateOne({ phone }, { step: "editar_setor" });
      return res.status(200).json({ message: "✏️ Ok — envie o *novo setor*:" });
    }
    return res.status(200).json({ message: "Opção inválida. Digite:\n1️⃣ Nome\n2️⃣ EDV\n3️⃣ Setor" });
  }

  // Edição
  if (["editar_nome", "editar_edv", "editar_setor"].includes(user.step)) {
    if (!msg) return res.status(200).json({ message: "Envie o novo valor:" });
    const updates = {};
    if (user.step === "editar_nome") updates.nome = msg;
    if (user.step === "editar_edv") {
      if (!isValidEdv(msg)) return res.status(200).json({ message: "EDV inválido. Deve ter 8 dígitos numéricos." });
      updates.edv = msg;
    }
    if (user.step === "editar_setor") updates.setor = msg;
    updates.step = "confirmar_dados";
    await User.updateOne({ phone }, updates);
    const u = await User.findOne({ phone });
    return res.status(200).json({
      message:
        `🔎 *Confirme seus dados atualizados:*\n\n` +
        `👤 Nome: *${u.nome}*\n🆔 EDV: *${u.edv}*\n🏢 Setor: *${u.setor}*\n\nDeseja confirmar?\n\n1️⃣ Sim\n2️⃣ Não`
    });
  }

  // ====== MENU ======
  if (user.step === "menu") {
    if (msg === "1") {
      const quadras = await Quadra.find();
      if (!quadras.length) return res.status(200).json({ message: "Nenhuma quadra cadastrada 🏗️" });
      const lista = quadras.map((q, i) => `${i + 1}. ${q.nome}`).join("\n");
      await User.updateOne({ phone }, { step: "selecionar_quadra" });
      return res.status(200).json({
        message: `🏟️ *Quadras disponíveis:*\n\n${lista}\n\nDigite o número da quadra.\n\n↩️ Digite *0* para voltar.`
      });
    }
    if (msg === "2") {
      return res.status(200).json({
        message: "🍖 Em breve será possível reservar as churrasqueiras!\n\n↩️ Digite *0* para voltar."
      });
    }
    return res.status(200).json({
      message: "Opção inválida ❌\nDigite:\n1️⃣ Quadras\n2️⃣ Churrasqueiras"
    });
  }

  // ====== SELECIONAR QUADRA ======
  if (user.step === "selecionar_quadra") {
    if (msg === "0") {
      await User.updateOne({ phone }, { step: "menu" });
      return res.status(200).json({
        message: "↩️ Voltando ao menu principal...\n\n1️⃣ Quadras\n2️⃣ Churrasqueiras"
      });
    }

    if (!/^\d+$/.test(msg)) return res.status(200).json({ message: "Envie apenas o número da quadra ou *0* para voltar." });
    const quadras = await Quadra.find();
    const index = parseInt(msg) - 1;
    const quadra = quadras[index];
    if (!quadra) return res.status(200).json({ message: "❌ Número inválido. Tente novamente ou *0* para voltar." });

    await User.updateOne({ phone }, { step: "selecionar_horario", selectedQuadra: quadra._id });
    const horarios = quadra.horarios
      .map((h, i) => `${i + 1}. ${h.horario} - ${h.reservado ? "❌ Reservado" : "✅ Disponível"}`)
      .join("\n");

    return res.status(200).json({
      message: `🕐 *Horários da ${quadra.nome}:*\n\n${horarios}\n\nDigite o número do horário.\n\n↩️ Digite *0* para voltar.`
    });
  }

  // ====== SELECIONAR HORÁRIO ======
  if (user.step === "selecionar_horario") {
    if (msg === "0") {
      const quadras = await Quadra.find();
      const lista = quadras.map((q, i) => `${i + 1}. ${q.nome}`).join("\n");
      await User.updateOne({ phone }, { step: "selecionar_quadra", selectedQuadra: null });
      return res.status(200).json({
        message: `↩️ Voltando à lista de quadras...\n\n🏟️ *Quadras disponíveis:*\n\n${lista}\n\nDigite o número da quadra ou *0* para voltar.`
      });
    }

    if (!/^\d+$/.test(msg)) return res.status(200).json({ message: "Envie apenas o número do horário ou *0* para voltar." });

    const quadra = await Quadra.findById(user.selectedQuadra);
    const index = parseInt(msg) - 1;
    const horario = quadra?.horarios[index];
    if (!horario) return res.status(200).json({ message: "❌ Número inválido. Tente novamente ou *0* para voltar." });
    if (horario.reservado) return res.status(200).json({ message: "⚠️ Esse horário já está reservado. Escolha outro ou *0* para voltar." });

    await User.updateOne({ phone }, { step: "confirmar_reserva", pendingHorarioIndex: index });
    return res.status(200).json({
      message: `🕐 Você selecionou o horário *${horario.horario}* na *${quadra.nome}*.\n\nDeseja confirmar a reserva?\n\n1️⃣ Sim\n2️⃣ Não\n\n↩️ Digite *0* para voltar.`
    });
  }

  // ====== CONFIRMAR RESERVA ======
  if (user.step === "confirmar_reserva") {
    const quadra = await Quadra.findById(user.selectedQuadra);
    const horario = quadra?.horarios[user.pendingHorarioIndex];
    if (!quadra || !horario) return res.status(200).json({ message: "❌ Erro ao localizar horário. Digite *0* para voltar." });

    if (msg === "0") {
      await User.updateOne({ phone }, { step: "selecionar_horario", pendingHorarioIndex: null });
      const horarios = quadra.horarios.map((h, i) => `${i + 1}. ${h.horario} - ${h.reservado ? "❌ Reservado" : "✅ Disponível"}`).join("\n");
      return res.status(200).json({
        message: `↩️ Voltando aos horários da ${quadra.nome}...\n\n${horarios}\n\nDigite o número do horário ou *0* para voltar.`
      });
    }

    if (msg === "1") {
      if (horario.reservado) return res.status(200).json({ message: "⚠️ Esse horário acabou de ser reservado por outra pessoa. Escolha outro." });
      horario.reservado = true;
      horario.reservadoPor = { nome: user.nome, edv: user.edv, setor: user.setor };
      await quadra.save();
      await User.updateOne({ phone }, { step: "menu", selectedQuadra: null, pendingHorarioIndex: null });
      return res.status(200).json({
        message: `✅ *Reserva confirmada!*\n\n📍 Quadra: *${quadra.nome}*\n🕐 Horário: *${horario.horario}*\n👤 ${user.nome} (${user.setor})\n\nDeseja fazer outra reserva?\n\n1️⃣ Quadras\n2️⃣ Churrasqueiras`
      });
    }

    if (msg === "2") {
      await User.updateOne({ phone }, { step: "selecionar_horario", pendingHorarioIndex: null });
      const horarios = quadra.horarios.map((h, i) => `${i + 1}. ${h.horario} - ${h.reservado ? "❌ Reservado" : "✅ Disponível"}`).join("\n");
      return res.status(200).json({
        message: `🔁 Tudo bem!\n\n🕐 *Horários da ${quadra.nome}:*\n\n${horarios}\n\nDigite o número do horário que deseja reservar.`
      });
    }

    return res.status(200).json({ message: "Digite 1️⃣ para confirmar, 2️⃣ para cancelar ou 0️⃣ para voltar." });
  }

  // ====== FALLBACK ======
  return res.status(200).json({
    message: "👋 Olá! Escolha uma opção:\n\n1️⃣ Quadras\n2️⃣ Churrasqueiras"
  });
};


