const ParticipanteModel = require("../models/participante");

class ParticipantesController {
    constructor() {
        this.participanteModel = new ParticipanteModel();
        this.mostrarParticipantes = this.mostrarParticipantes.bind(this);
        this.agregarParticipante = this.agregarParticipante.bind(this);
        this.actualizarParticipante = this.actualizarParticipante.bind(this);
        this.eliminarParticipante = this.eliminarParticipante.bind(this);

        // --- NUEVO ---
        // Se añade el bind para el nuevo método que mostrará la página de apuestas.
        this.mostrarParticipantesParaApuestas = this.mostrarParticipantesParaApuestas.bind(this);
    }

    // Este método sigue funcionando para tu vista original de 'participantes'.
    async mostrarParticipantes(req, res) {
        try {
            const participantes = await this.participanteModel.obtenerTodos();
            res.render("participantes", { participantes });
        } catch (error) {
            console.error("Error al mostrar participantes:", error);
            res.status(500).send("Error al cargar la página de participantes.");
        }
    }
    
    // --- NUEVO MÉTODO ---
    // Este método se encargará de renderizar la nueva vista 'apuestas.ejs'.
    // Reutiliza la lógica de obtener todos los participantes, pero apunta a una vista diferente.
    async mostrarParticipantesParaApuestas(req, res) {
        try {
            const participantes = await this.participanteModel.obtenerTodos();
            res.render("apuestas", { participantes });
        } catch (error) {
            console.error("Error al mostrar la página de apuestas:", error);
            res.status(500).send("Error al cargar la página de apuestas.");
        }
    }

    async agregarParticipante(req, res) {
        try { 
            const foto_nombre = req.file ? req.file.filename : 'npc.webp';
            const nuevoParticipante = {
                nombre: req.body.nombre,
                categoria: req.body.categoria,
                trofeos: parseInt(req.body.trofeos) || 0,
                medallas: parseInt(req.body.medallas) || 0,
                segundos_puestos: parseInt(req.body.segundos_puestos) || 0,
                copas_liga: parseInt(req.body.copas_liga) || 0,
                foto: foto_nombre
            };
            
            const participanteConId = await this.participanteModel.agregarParticipante(nuevoParticipante);
            res.status(201).json({ message: 'Participante agregado con éxito', participante: participanteConId });
        } catch (error) {
            console.error("Error al agregar participante:", error);
            res.status(500).json({ error: 'Error al agregar participante' });
        }
    }

    async actualizarParticipante(req, res) {
        try {
            const id = req.params.id;
            const foto_nombre = req.file ? req.file.filename : req.body.foto;

            const datosActualizados = {
                nombre: req.body.nombre,
                categoria: req.body.categoria,
                trofeos: parseInt(req.body.trofeos) || 0,
                medallas: parseInt(req.body.medallas) || 0,
                segundos_puestos: parseInt(req.body.segundos_puestos) || 0,
                copas_liga: parseInt(req.body.copas_liga) || 0,
                foto: foto_nombre
            };
            
            await this.participanteModel.actualizarParticipante(id, datosActualizados);
            const participanteActualizado = await this.participanteModel.obtenerPorId(id);
            res.json({ message: 'Participante actualizado con éxito', participante: participanteActualizado });
        } catch (error) {
            console.error("Error al actualizar participante:", error);
            res.status(500).json({ error: 'Error al actualizar participante' });
        }
    }

    async eliminarParticipante(req, res) {
        try {
            const id = req.params.id;
            await this.participanteModel.eliminarParticipante(id);
            res.json({ message: 'Participante eliminado con éxito' });
        } catch (error) {
            console.error("Error al eliminar participante:", error);
            res.status(500).json({ error: 'Error al eliminar participante' });
        }
    }
}

module.exports = ParticipantesController;