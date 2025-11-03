const Conversation = require("../model/conversation");

const WhatsAppController = {
  async receiveMessage(req, res) {
    try {
      const { phone, message } = req.body;
      const normalizedPhone = phone.split("@")[0];
      const msg = message.trim();

      // Procura conversa existente no banco
      let conversation = await Conversation.findOne({ phone: normalizedPhone });

      // Se não existe, cria nova e define passo inicial
      if (!conversation) {
        conversation = await Conversation.create({
          phone: normalizedPhone,
          step: "waiting_user_info"
        });

        // Salva a mensagem inicial do usuário
        await Conversation.create({
          phone: normalizedPhone,
          message: msg,
          sender: "user",
          step: "waiting_user_info"
        });

        return res.status(200).json({
          message:
            "Olá! 😃 Antes de começarmos, por favor, envie suas informações neste formato:\n\n👉 Nome - EDV(8 números) - Setor\n\nExemplo:\nRenato - 90902712 - Manutenção"
        });
      }

      // Salva a mensagem do usuário
      await Conversation.create({
        phone: normalizedPhone,
        message: msg,
        sender: "user",
        step: conversation.step
      });

      // Comando finalizar
      if (msg.toLowerCase() === "finalizar") {
        await Conversation.deleteMany({ phone: normalizedPhone });
        return res
          .status(200)
          .json({ message: "✅ Atendimento finalizado. Até logo!" });
      }

      // Comando voltar
      if (msg.toLowerCase() === "voltar") {
        if (
          conversation.step === "quadra_tipo" ||
          conversation.step === "churrasqueira_local"
        ) {
          conversation.step = "menu_principal";
          await conversation.save();
          return res.status(200).json({
            message:
              "Voltando ao menu principal:\n\n1 - Reserva de quadra\n2 - Sorteio da churrasqueira"
          });
        }

        return res.status(200).json({
          message: "Você já está no início. Envie suas informações para continuar."
        });
      }

      // ======== ETAPAS DO FLUXO ========

      // Aguarda dados do usuário
      if (conversation.step === "waiting_user_info") {
        const parts = msg.split("-").map((p) => p.trim());
        if (parts.length === 3 && /^\d{8}$/.test(parts[1])) {
          const [name, edv, sector] = parts;
          conversation.userInfo = { name, edv, sector };
          conversation.step = "menu_principal";
          await conversation.save();

          return res.status(200).json({
            message: `Perfeito, ${name}! 😃\nEscolha uma das opções abaixo:\n\n1 - Reserva de quadra\n2 - Sorteio da churrasqueira\n\n(Envie 'finalizar' para encerrar o atendimento)`
          });
        } else {
          return res.status(200).json({
            message:
              "⚠️ Formato inválido. Envie no formato:\n\nNome - EDV - Setor"
          });
        }
      }

      // Menu principal
      if (conversation.step === "menu_principal") {
        if (msg === "1") {
          conversation.step = "quadra_tipo";
          await conversation.save();
          return res.status(200).json({
            message:
              "Qual tipo de quadra você deseja reservar?\n\n1 - Sintético\n2 - Futsal\n\n(Digite 'voltar' para retornar)"
          });
        }

        if (msg === "2") {
          conversation.step = "churrasqueira_local";
          await conversation.save();
          return res.status(200).json({
            message:
              "Escolha a churrasqueira desejada:\n\n1 - Jardim Botânico\n2 - Passaúna\n\n(Digite 'voltar' para retornar)"
          });
        }

        return res.status(200).json({
          message:
            "⚠️ Opção inválida. Escolha:\n\n1 - Reserva de quadra\n2 - Sorteio da churrasqueira"
        });
      }

      // Reserva de quadra
      if (conversation.step === "quadra_tipo") {
        if (msg === "1") {
          return res.status(200).json({
            message:
              "✅ Quadra sintética selecionada!\n\nDigite 'finalizar' para encerrar ou 'voltar' para o menu anterior."
          });
        }

        if (msg === "2") {
          return res.status(200).json({
            message:
              "✅ Quadra de futsal selecionada!\n\nDigite 'finalizar' para encerrar ou 'voltar' para o menu anterior."
          });
        }

        return res.status(200).json({
          message:
            "⚠️ Opção inválida. Escolha:\n\n1 - Sintético\n2 - Futsal\n\nOu digite 'voltar'."
        });
      }

      // Churrasqueira
      if (conversation.step === "churrasqueira_local") {
        if (msg === "1") {
          return res.status(200).json({
            message:
              "🔥 Churrasqueira do Jardim Botânico selecionada!\n\nDigite 'finalizar' para encerrar ou 'voltar' para o menu anterior."
          });
        }

        if (msg === "2") {
          return res.status(200).json({
            message:
              "🔥 Churrasqueira do Passaúna selecionada!\n\nDigite 'finalizar' para encerrar ou 'voltar' para o menu anterior."
          });
        }

        return res.status(200).json({
          message:
            "⚠️ Opção inválida. Escolha:\n\n1 - Jardim Botânico\n2 - Passaúna\n\nOu digite 'voltar'."
        });
      }
    } catch (error) {
      console.error("Erro no controller:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
};

module.exports = WhatsAppController;
