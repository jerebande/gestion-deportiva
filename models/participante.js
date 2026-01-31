const conx = require("../database/db");

class ParticipanteModel {

    obtenerTodos() {
        return new Promise((resolve, reject) => {
            // Se calcula la suma de trofeos, medallas y copas_liga en la propia consulta
            // y se usa para ordenar de forma descendente.
            // Luego, se usa segundos_puestos para desempatar, también de forma descendente.
            const query = `
                SELECT
                    id, nombre, foto, trofeos, medallas,
                    segundos_puestos, copas_liga, division as categoria
                FROM competidores
                ORDER BY (trofeos + medallas + copas_liga) DESC, segundos_puestos DESC;
            `;

            conx.query(query, (err, resultados) => {
                if (err) return reject(err);
                resolve(resultados);
            });
        });
    }

    agregarParticipante(participante) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO competidores (nombre, division, foto, trofeos, medallas, segundos_puestos, copas_liga)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                participante.nombre, participante.categoria, participante.foto,
                participante.trofeos, participante.medallas, participante.segundos_puestos,
                participante.copas_liga
            ];
            conx.query(query, params, (err, resultado) => {
                if (err) return reject(err);

                const nuevoId = resultado.insertId;
                const estatisticasQuery = `INSERT INTO estatisticas (id) VALUES (?)`;
                conx.query(estatisticasQuery, [nuevoId], (errEst) => {
                    if (errEst) {
                        return reject(errEst);
                    }
                    resolve({ id: nuevoId, ...participante });
                });
            });
        });
    }

    actualizarParticipante(id, datos) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE competidores SET
                    nombre = ?, foto = ?, trofeos = ?, medallas = ?,
                    segundos_puestos = ?, copas_liga = ?, division = ?
                WHERE id = ?
            `;
            const params = [
                datos.nombre, datos.foto, datos.trofeos, datos.medallas,
                datos.segundos_puestos, datos.copas_liga, datos.categoria, id
            ];
            conx.query(query, params, (err, resultado) => {
                if (err) return reject(err);
                resolve(resultado);
            });
        });
    }

    eliminarParticipante(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM competidores WHERE id = ?";
            conx.query(query, [id], (err, resultado) => {
                if (err) return reject(err);
                resolve(resultado);
            });
        });
    }

    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, nombre, foto, trofeos, medallas, segundos_puestos, copas_liga, division as categoria
                FROM competidores WHERE id = ?
            `;
            conx.query(query, [id], (err, resultados) => {
                if (err) return reject(err);
                resolve(resultados[0]);
            });
        });
    }
}

module.exports = ParticipanteModel;