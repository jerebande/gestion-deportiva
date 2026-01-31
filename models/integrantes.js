const conx = require("../database/db");

class Integrantesmodel {
   actualizarEstadisticas(id, data) {
  return new Promise((resolve, reject) => {
    const {
      partidos_jugados,
      partidos_ganados,
      partidos_empatados,
      partidos_perdidos,
      goles_a_favor,
      goles_en_contra,
      diferencia_goles,
      puntos
    } = data;

    conx.query(
      `UPDATE jugadores 
       SET partidos_jugados = ?, partidos_ganados = ?, partidos_empatados = ?, 
           partidos_perdidos = ?, goles_a_favor = ?, goles_en_contra = ?, 
           diferencia_goles = ?, puntos = ?
       WHERE id = ?`,
      [
        partidos_jugados, partidos_ganados, partidos_empatados,
        partidos_perdidos, goles_a_favor, goles_en_contra,
        diferencia_goles, puntos, id
      ],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}


  sumarPuntos(id, puntos) {
  return new Promise((resolve, reject) => {
    conx.query("UPDATE jugadores SET puntos = puntos + ? WHERE id = ?", [puntos, id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}


   obtenerFasesConJugadores() {
    return new Promise((resolve, reject) => {
        conx.query(
            "SELECT * FROM jugadores ORDER BY fase ASC, puntos DESC, diferencia_goles DESC, nombre ASC",
            (err, resultados) => {
                if (err) return reject(err);
                const fases = [];
                resultados.forEach(j => {
                    if (!fases[j.fase - 1]) fases[j.fase - 1] = [];
                    fases[j.fase - 1].push(j);
                });
                resolve(fases);
            }
        );
    });
}


    eliminarJugadoresPorFase(fase) {
  return new Promise((resolve, reject) => {
    conx.query("DELETE FROM jugadores WHERE fase = ?", [fase], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

    async crearFases(data) {
        const fases = Object.keys(data).filter(key => key.startsWith("nombresFase"));

        for (const faseKey of fases) {
            const numeroFase = parseInt(faseKey.replace("nombresFase", ""));
            const nombres = data[faseKey];

            // Si solo se cargó 1 nombre, no viene como array
            const lista = Array.isArray(nombres) ? nombres : [nombres];

            for (const nombre of lista) {
                await integrantesmodel.insertarJugador(nombre, numeroFase);
            }
        }
    }

    async obtenerFases() {
        return await integrantesmodel.obtenerFasesConJugadores();
    }
    insertarJugador(nombre, fase) {
  return new Promise((resolve, reject) => {
    conx.query(`
      INSERT INTO jugadores 
      (nombre, fase, partidos_jugados, partidos_ganados, partidos_empatados, partidos_perdidos, goles_a_favor, goles_en_contra, diferencia_goles, puntos)
      VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0)
    `, [nombre, fase], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}


  
}

module.exports = Integrantesmodel;
