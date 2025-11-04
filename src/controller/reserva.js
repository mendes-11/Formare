const Reserva = require("../model/reserva");
const Quadra = require("../model/quadra");
const Horario = require("../model/horario");

const ReservaController = {
  // Criar reserva
  async create(req, res) {
    try {
      const { nomeCliente, telefone, quadraId, horarioId, dataReserva } = req.body;

      // Verifica se a quadra e o horário existem
      const quadra = await Quadra.findById(quadraId);
      const horario = await Horario.findById(horarioId);

      if (!quadra || !horario) {
        return res.status(404).json({ message: "Quadra ou horário não encontrados." });
      }

      // Verifica se o horário já está reservado
      const reservaExistente = await Reserva.findOne({ quadraId, horarioId, dataReserva });
      if (reservaExistente) {
        return res.status(400).json({ message: "Horário já reservado para essa quadra." });
      }

      // Cria a reserva
      const reserva = await Reserva.create({
        nomeCliente,
        telefone,
        quadraId,
        horarioId,
        dataReserva
      });

      // Marca o horário como indisponível
      horario.disponivel = false;
      await horario.save();

      return res.status(201).json({ message: "Reserva criada com sucesso!", reserva });
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      return res.status(500).json({ message: "Erro interno ao criar reserva." });
    }
  },

  // Listar reservas
  async getAll(req, res) {
    try {
      const reservas = await Reserva.find()
        .populate("quadraId", "nome")
        .populate("horarioId", "hora")
        .sort({ dataReserva: 1 });
      return res.status(200).json(reservas);
    } catch (error) {
      console.error("Erro ao listar reservas:", error);
      return res.status(500).json({ message: "Erro ao listar reservas." });
    }
  },

  // Buscar reservas por telefone (para integrar com o WhatsApp)
  async getByPhone(req, res) {
    try {
      const { telefone } = req.params;
      const reservas = await Reserva.find({ telefone })
        .populate("quadraId", "nome")
        .populate("horarioId", "hora");
      if (!reservas.length)
        return res.status(404).json({ message: "Nenhuma reserva encontrada." });

      return res.status(200).json(reservas);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      return res.status(500).json({ message: "Erro ao buscar reservas." });
    }
  },

  // Cancelar reserva
  async delete(req, res) {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findById(id);
      if (!reserva)
        return res.status(404).json({ message: "Reserva não encontrada." });

      // Libera o horário
      const horario = await Horario.findById(reserva.horarioId);
      if (horario) {
        horario.disponivel = true;
        await horario.save();
      }

      await reserva.deleteOne();
      return res.status(200).json({ message: "Reserva cancelada com sucesso." });
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      return res.status(500).json({ message: "Erro ao cancelar reserva." });
    }
  }
};

module.exports = ReservaController;
