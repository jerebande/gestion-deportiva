const Integrantesmodel = require("../models/integrantes");
const integrantesmodel = new Integrantesmodel();

class Integrantescontrollers {
  /**
   * Generates elimination matchups based on the number of phases and players.
   * This method determines initial classifications and direct semifinal matchups if applicable.
   * @returns {Object} An object containing:
   * - {Array} clasificados: Players who have qualified from their group stages, sorted by rank.
   * - {Array} semifinales: Directly determined semifinal matchups (if applicable for the current phase configuration).
   */
  async generarEliminatorias() {
    // Fetches all phases with their associated players from the database.
    // Each phase array is expected to contain player objects.
    const fases = await integrantesmodel.obtenerFasesConJugadores();
    let clasificados = []; // Stores players who have "classified" for the next stage (can be 4 for semis, or 8 for quarters)
    let semifinales = []; // Stores the direct semifinal matchups if determined by this method

    // Sort players within each phase based on points, goal difference, and goals for.
    // This ensures players are ranked correctly within their respective groups.
    fases.forEach(fase => {
      fase.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos; // Higher points first
        if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles; // Higher goal difference next
        if (b.goles_a_favor !== a.goles_a_favor) return b.goles_a_favor - a.goles_a_favor; // Higher goals for next
        return 0; // Maintain original order if all criteria are equal
      });
    });

    // --- SCENARIO 1: 1 Phase with 5 Players ---
    // In this setup, the top 4 players from the single phase advance directly to semifinals.
    if (fases.length === 1 && fases[0].length === 5) {
      const jugadoresFase = fases[0];
      // The 5th player is eliminated.
      clasificados = [
        jugadoresFase[0], // 1st ranked player
        jugadoresFase[1], // 2nd ranked player
        jugadoresFase[2], // 3rd ranked player
        jugadoresFase[3]  // 4th ranked player
      ];

      // Define specific semifinal matchups based on rank within the single phase.
      // This is a common seeding: 1st vs 4th, 2nd vs 3rd.
      semifinales.push({ local: jugadoresFase[0], visitante: jugadoresFase[3] });
      semifinales.push({ local: jugadoresFase[1], visitante: jugadoresFase[2] });

    // --- SCENARIO 2: 1 Phase with 7 Players ---
    // Similar to the 5-player scenario, the top 4 advance directly to semifinals.
    } else if (fases.length === 1 && fases[0].length === 7) {
      clasificados = fases[0].slice(0, 4); // Take the top 4 players from this phase.

      // Define specific semifinal matchups (e.g., 1st vs 4th, 2nd vs 3rd from the classified).
      semifinales.push({ local: clasificados[0], visitante: clasificados[3] });
      semifinales.push({ local: clasificados[1], visitante: clasificados[2] });

    // --- SCENARIO 3: 2 Phases with 3 Players Each ---
    // In this specific scenario, the 1st from one phase plays the 2nd from the other.
    } else if (fases.length === 2 && fases[0].length === 3 && fases[1].length === 3) {
      const primeroFase1 = fases[0][0]; // 1st from Phase 1
      const segundoFase1 = fases[0][1]; // 2nd from Phase 1
      const primeroFase2 = fases[1][0]; // 1st from Phase 2
      const segundoFase2 = fases[1][1]; // 2nd from Phase 2

      // These are the four players who will participate in the semifinals.
      clasificados = [primeroFase1, segundoFase1, primeroFase2, segundoFase2];

      // Define the specific cross-phase semifinal matchups as requested:
      // Semifinal 1: 1st of Phase 1 vs 2nd of Phase 2
      semifinales.push({ local: primeroFase1, visitante: segundoFase2 });
      // Semifinal 2: 1st of Phase 2 vs 2nd of Phase 1
      semifinales.push({ local: primeroFase2, visitante: segundoFase1 });

    // --- SCENARIO 4: 3 Phases with 3 Players Each (Total 9 Players) ---
    // This scenario typically leads to Quarter-Finals, where 8 players advance.
    // The top 2 from each phase (6 players) plus the 2 best third-place players.
    } else if (fases.length === 3 && fases.every(fase => fase.length === 3)) {
      let primerosYSegundos = []; // Stores 1st and 2nd from all phases
      let terceros = []; // Stores 3rd from all phases

      fases.forEach(fase => {
        primerosYSegundos.push(fase[0]); // Add 1st player
        primerosYSegundos.push(fase[1]); // Add 2nd player
        terceros.push(fase[2]); // Add 3rd player
      });

      // Sort the third-place players to find the two best among them.
      terceros.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
        if (b.goles_a_favor !== a.goles_a_favor) return b.goles_a_favor - a.goles_a_favor;
        return 0;
      });

      const mejoresTerceros = terceros.slice(0, 2); // Get the two best third-place players.
      
      // Combine all qualified players (6 from 1st/2nd + 2 best 3rd) to get 8 players for quarters.
      clasificados = [...primerosYSegundos, ...mejoresTerceros];

      // Sort these 8 classified players by their overall ranking (important for quarter-final seeding).
      clasificados.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
        if (b.goles_a_favor !== a.goles_a_favor) return b.goles_a_favor - a.goles_a_favor;
        return 0;
      });
      // In this scenario, `semifinales` remains empty, as the next stage is typically Quarter-Finals.
      // The router will then use the `clasificados` array to render the quarter-finals setup.
    }

    // Return both the list of classified players and any directly determined semifinal matchups.
    return { clasificados, semifinales };
  }

  /**
   * Generates quarter-final matchups based on administrator input for specific pairings.
   * @param {Array<Object>} cuartosDefinidosPorAdmin - An array of objects defining each quarter-final match with localId and visitanteId.
   * @returns {Array<Object>} An array of quarter-final match objects with full player data.
   * @throws {Error} If there are not exactly 8 classified players or if a player ID is not found.
   */
  async generarCuartosDeFinal(cuartosDefinidosPorAdmin) {
    // Get all classified players from the elimination stage.
    // Note: The `clasificados` here should be the 8 players from the 3 phases x 3 players scenario.
    const { clasificados } = await this.generarEliminatorias();

    // Ensure there are 8 classified players to proceed to quarters.
    if (clasificados.length !== 8) {
      throw new Error("No hay 8 jugadores clasificados para los cuartos de final.");
    }

    // Map the admin-defined matchups to include full player objects.
    const cuartos = cuartosDefinidosPorAdmin.map(match => {
      const local = clasificados.find(j => j.id === match.localId);
      const visitante = clasificados.find(j => j.id === match.visitanteId);

      if (!local || !visitante) {
        throw new Error(`Jugador no encontrado en la lista de clasificados para los cuartos de final. ID: ${match.localId} o ${match.visitanteId}`);
      }
      return { id: match.id, local, visitante };
    });

    return cuartos;
  }

  /**
   * Generates semifinal matchups from the 4 winners of the quarter-finals.
   * @param {Array<Object>} ganadoresCuartos - An array of 4 player objects who won their quarter-final matches.
   * @returns {Array<Object>} An array of two semifinal match objects.
   * @throws {Error} If there are not exactly 4 quarter-final winners.
   */
  async generarSemifinalesDesdeCuartos(ganadoresCuartos) {
  if (ganadoresCuartos.length !== 4) {
    throw new Error("Se necesitan 4 ganadores de cuartos para generar las semifinales.");
  }

  // Semifinales por llave fija: 1vs2 y 3vs4 (sin ordenar)
  const semifinales = [
    { id: 1, local: ganadoresCuartos[0], visitante: ganadoresCuartos[1] }, // Partido 1 vs Partido 2
    { id: 2, local: ganadoresCuartos[2], visitante: ganadoresCuartos[3] }  // Partido 3 vs Partido 4
  ];

  return semifinales;
}


  /**
   * Generates semifinal matchups directly from 4 classified players, without prior quarter-finals.
   * This is used when `generarEliminatorias` only returns 4 classified players but not predefined `semifinales`.
   * @param {Array<Object>} clasificados - An array of 4 player objects who are directly classified for semifinals.
   * @returns {Array<Object>} An array of two semifinal match objects.
   * @throws {Error} If there are not exactly 4 classified players.
   */
  async generarSemifinalesDirectas(clasificados) {
    if (clasificados.length !== 4) {
      throw new Error("Se necesitan 4 clasificados para generar las semifinales directas.");
    }
    
    // Sort classified players to ensure fair pairings.
    clasificados.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
        if (b.goles_a_favor !== a.goles_a_favor) return b.goles_a_favor - a.goles_a_favor;
        return 0;
    });

    // Standard semifinal pairings (1st vs 4th, 2nd vs 3rd).
    const semifinales = [
      { id: 1, local: clasificados[0], visitante: clasificados[3] },
      { id: 2, local: clasificados[1], visitante: clasificados[2] }
    ];
    return semifinales;
  }

  /**
   * Generates the final match from the 2 winners of the semifinals.
   * @param {Array<Object>} ganadoresSemifinales - An array of 2 player objects who won their semifinal matches.
   * @returns {Object} An object representing the final match with the two finalists.
   * @throws {Error} If there are not exactly 2 semifinal winners.
   */
  async generarFinalDesdeSemifinales(ganadoresSemifinales) {
    if (ganadoresSemifinales.length !== 2) {
      throw new Error("Se necesitan 2 ganadores de semifinales para generar la final.");
    }
    const final = {
      jugador1: ganadoresSemifinales[0],
      jugador2: ganadoresSemifinales[1]
    };
    return final;
  }

  /**
   * Updates a player's statistics and recalculates derived stats like goal difference and points.
   * @param {number} id - The ID of the player to update.
   * @param {Object} data - An object containing player statistics (e.g., pj, pg, pe, pp, gf, gc).
   */
  async actualizarEstadisticas(id, data) {
    const diferencia_goles = data.goles_a_favor - data.goles_en_contra;
    const puntos = (data.partidos_ganados * 3) + (data.partidos_empatados);

    const dataActualizada = {
      ...data,
      diferencia_goles,
      puntos
    };

    await integrantesmodel.actualizarEstadisticas(id, dataActualizada);
  }

  /**
   * Adds points to a specific player.
   * @param {number} id - The ID of the player.
   * @param {number} puntos - The number of points to add.
   */
  async sumarPuntos(id, puntos) {
    await integrantesmodel.sumarPuntos(id, puntos);
  }

  /**
   * Creates new phases and adds players to them based on provided data.
   * @param {Object} data - Form data containing phase names and player names.
   */
  async crearFases(data) {
    const fases = Object.keys(data).filter(key => key.startsWith("nombresFase"));

    for (const faseKey of fases) {
      const numeroFase = parseInt(faseKey.replace("nombresFase", ""));
      const nombres = data[faseKey];
      // Ensure names is always an array to handle single inputs or multiple.
      const lista = Array.isArray(nombres) ? nombres : [nombres];

      for (const nombre of lista) {
        await integrantesmodel.insertarJugador(nombre, numeroFase);
      }
    }
  }

  /**
   * Retrieves all phases along with their players.
   * @returns {Array<Object>} An array of phase objects, each containing its players.
   */
  async obtenerFases() {
    return await integrantesmodel.obtenerFasesConJugadores();
  }

  /**
   * Deletes all players associated with a specific phase.
   * @param {number} fase - The phase number to delete players from.
   */
  async eliminarFase(fase) {
    await integrantesmodel.eliminarJugadoresPorFase(fase);
  }

}

// These global variables are used by the router to pass results between requests.
// They are not part of the controller class itself but are often defined alongside it
// or within the main application file (e.g., app.js) for state management.
// You might consider moving these to a more robust state management solution
// if your application grows.
// let semifinalesResultados = [];
// let finalResultado = null;

module.exports = Integrantescontrollers;