const LigaModel = require("../models/liga");

class LigaController {

  constructor() {
    this.ligaModel = new LigaModel();
    // Vinculamos todos los métodos para que 'this' siempre se refiera a la instancia
    this.mostrarLigas = this.mostrarLigas.bind(this);
    this.agregarJugador = this.agregarJugador.bind(this);
    this.actualizarTabla = this.actualizarTabla.bind(this);
    this.aplicarDescensosYAscensos = this.aplicarDescensosYAscensos.bind(this);
  }

  async mostrarLigas(req, res) {
    try {
      const [ligaA, ligaB] = await Promise.all([
        this.ligaModel.obtenerJugadoresPorDivision('A'),
        this.ligaModel.obtenerJugadoresPorDivision('B')
      ]);
      res.render("liga", { ligaA, ligaB });
    } catch (error) {
      console.error("Error al obtener las ligas:", error);
      res.status(500).send("Error al cargar las ligas.");
    }
  }

  async agregarJugador(req, res) {
    try {
      const { nombre, division } = req.body;
      if (!nombre || !division) {
        return res.status(400).send("Nombre y división son requeridos.");
      }
      await this.ligaModel.agregarJugador(nombre, division);
      res.redirect("/liga");
    } catch (error) {
      console.error("Error al agregar jugador:", error);
      res.status(500).send("Error al agregar jugador.");
    }
  }

  async actualizarTabla(req, res) {
    try {
      const { id, pj, pg, pe, pp, gf, gc } = req.body;
      // Normaliza los datos a un array si solo se envía un jugador
      const ids = Array.isArray(id) ? id : [id];

      const jugadoresStats = ids.map((playerId, index) => {
        const pgVal = Array.isArray(pg) ? parseInt(pg[index]) : parseInt(pg);
        const peVal = Array.isArray(pe) ? parseInt(pe[index]) : parseInt(pe);
        const gfVal = Array.isArray(gf) ? parseInt(gf[index]) : parseInt(gf);
        const gcVal = Array.isArray(gc) ? parseInt(gc[index]) : parseInt(gc);
        
        const pts = (pgVal * 3) + peVal;
        const dg = gfVal - gcVal;
        
        return {
          id: parseInt(playerId),
          pj: Array.isArray(pj) ? parseInt(pj[index]) : parseInt(pj),
          pg: pgVal,
          pe: peVal,
          pp: Array.isArray(pp) ? parseInt(pp[index]) : parseInt(pp),
          gf: gfVal,
          gc: gcVal,
          dg,
          pts
        };
      });

      await this.ligaModel.actualizarTabla(jugadoresStats);
      res.redirect("/liga");
    } catch (error) {
      console.error("Error al actualizar la tabla:", error);
      res.status(500).send("Error al actualizar la tabla.");
    }
  }
  
  async aplicarDescensosYAscensos(req, res) {
    try {
      const cantidadDescensos = parseInt(req.body.cantidadDescensos);
      if (isNaN(cantidadDescensos) || cantidadDescensos < 0) {
        return res.status(400).send("Cantidad de descensos inválida.");
      }

      const [jugadoresA, jugadoresB] = await Promise.all([
        this.ligaModel.obtenerJugadoresPorDivision('A'),
        this.ligaModel.obtenerJugadoresPorDivision('B')
      ]);

      if (cantidadDescensos > 0 && jugadoresA.length >= cantidadDescensos) {
        const jugadoresADescender = jugadoresA.slice(-cantidadDescensos);
        await Promise.all(jugadoresADescender.map(j => this.ligaModel.cambiarDivision(j.id, 'B')));
      }

      if (jugadoresB.length > 0) {
        const jugadorAAscender = jugadoresB[0];
        await this.ligaModel.cambiarDivision(jugadorAAscender.id, 'A');
      }

      await this.ligaModel.resetearEstadisticas();

      res.redirect("/liga");
    } catch (error) {
      console.error("Error al aplicar descensos y ascensos:", error);
      res.status(500).send("Error en el proceso de descensos/ascensos.");
    }
  }
}

module.exports = LigaController;