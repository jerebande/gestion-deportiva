const conx = require("../database/db");

class LigaParticipantesModel {

  /**
   * Obtiene todos los jugadores de una división, ordenados por rendimiento.
   * @param {string} division - La división a consultar ('A' o 'B').
   * @returns {Promise<Array>} Una lista de jugadores de la división.
   */
  obtenerJugadoresPorDivision(division) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM liga_participantes
        WHERE division = ? 
        ORDER BY puntos DESC, diferencia_goles DESC, goles_a_favor DESC, nombre ASC
      `;
      conx.query(query, [division], (err, resultados) => {
        if (err) return reject(err);
        resolve(resultados);
      });
    });
  }

  /**
   * Inserta un nuevo jugador en la base de datos con una división específica.
   * @param {string} nombre - Nombre del jugador.
   * @param {string} division - División ('A' o 'B').
   * @returns {Promise<void>}
   */
  agregarJugador(nombre, division) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO liga_participantes
        (nombre, division, partidos_jugados, partidos_ganados, partidos_empatados, partidos_perdidos, goles_a_favor, goles_en_contra, diferencia_goles, puntos)
        VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0)
      `;
      conx.query(query, [nombre, division], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  /**
   * ***NUEVO MÉTODO***
   * Registra los resultados de un partido y actualiza las estadísticas de los jugadores.
   * La lógica de cálculo ahora debe hacerse en el controlador o en la vista.
   * Este método solo guarda los datos de la tabla.
   * @param {object[]} jugadoresStats - Un array de objetos con las estadísticas actualizadas.
   * @returns {Promise<void>}
   */
  async actualizarTabla(jugadoresStats) {
    return new Promise((resolve, reject) => {
        if (jugadoresStats.length === 0) {
            return resolve();
        }

        const updates = jugadoresStats.map(jugador => {
            const query = `
                UPDATE liga_participantes SET 
                    partidos_jugados = ?,
                    partidos_ganados = ?,
                    partidos_empatados = ?,
                    partidos_perdidos = ?,
                    goles_a_favor = ?,
                    goles_en_contra = ?,
                    diferencia_goles = ?,
                    puntos = ?
                WHERE id = ?
            `;
            const params = [
                jugador.pj, jugador.pg, jugador.pe, jugador.pp,
                jugador.gf, jugador.gc, jugador.dg, jugador.pts,
                jugador.id
            ];
            return conx.query(query, params);
        });

        Promise.all(updates)
            .then(() => resolve())
            .catch(err => reject(err));
    });
  }

  /**
   * Cambia la división de un jugador.
   * @param {number} id - ID del jugador.
   * @param {string} nuevaDivision - La nueva división ('A' o 'B').
   * @returns {Promise<void>}
   */
  cambiarDivision(id, nuevaDivision) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE liga_participantes SET division = ? WHERE id = ?";
      conx.query(query, [nuevaDivision, id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  /**
   * Resetea todas las estadísticas de todos los jugadores.
   * Este método pone a cero todas las estadísticas de todos los jugadores de la tabla 'liga'.
   */
  async resetearEstadisticas() {
    return new Promise((resolve, reject) => {
      const resetJugadoresQuery = `
        UPDATE liga_participantes SET 
          partidos_jugados = 0, 
          partidos_ganados = 0, 
          partidos_empatados = 0, 
          partidos_perdidos = 0, 
          goles_a_favor = 0, 
          goles_en_contra = 0, 
          puntos = 0, 
          diferencia_goles = 0
      `;
      conx.query(resetJugadoresQuery, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = LigaParticipantesModel;