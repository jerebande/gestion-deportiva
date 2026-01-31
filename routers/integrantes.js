const express = require("express");
const router = express.Router();
const Integrantescontroller = require("../controllers/integrantes");
const integrantescontrollers = new Integrantescontroller();
const LigaController = require("../controllers/liga"); // <-- Importa el nuevo controlador
const ligaController = new LigaController();
let cuartosResultados = []; // Variable to store quarter-final results
let semifinalesResultados = []; // Variable to store semi-final results
let finalResultado = null; 
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {                                                 
        cb(null, path.join(__dirname, '../public/images/')); // Carpeta donde se guardarán las fotos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// Variable to store final result
// La ruta para reiniciar la temporada ahora llamará al nuevo método del controlador
router.post("/liga/relegation", ligaController.aplicarDescensosYAscensos);
// --- Routes for Quarter-Finals ---
// ... (otro código de tu router)

// Suponiendo que tienes un controlador para participantes
const ParticipantesController = require("../controllers/participantes"); 
const participantesController = new ParticipantesController();
router.get("/participantes", participantesController.mostrarParticipantes);
router.post("/participantes", upload.single('foto_file'), participantesController.agregarParticipante);
router.post("/participantes/actualizar/:id", upload.single('foto_file'), participantesController.actualizarParticipante);
router.delete("/participantes/eliminar/:id", participantesController.eliminarParticipante);

router.get("/liga", ligaController.mostrarLigas);

// Procesa el formulario para agregar un nuevo jugador
router.post("/liga/agregar-jugador", ligaController.agregarJugador);
router.get("/apuestas", participantesController.mostrarParticipantesParaApuestas);
// Procesa el guardado de todas las estadísticas de las tablas
router.post("/liga/actualizar", ligaController.actualizarTabla);

// Procesa el formulario de descensos y ascensos
router.post("/liga/relegation", ligaController.aplicarDescensosYAscensos);
router.get("/cuartos", async (req, res) => {
  try {
    // This method needs to return all players if you want the admin to pick matchups.
    // Or, it should return exactly 8 players to start quarters.
    const { clasificados } = await integrantescontrollers.generarEliminatorias();

    // If there's 1 phase with 5 players, generarEliminatorias already handles the 1st vs 4th, 2nd vs 3rd setup for semifinals.
    // So, this /cuartos route should likely not be hit in that specific scenario.
    // This /cuartos route assumes you have 8 players to set up traditional quarterfinals.

    // Ensure exactly 8 players for traditional quarterfinals
    const jugadoresParaCuartos = clasificados.length === 8 ? clasificados : (clasificados.length === 9 ? clasificados.slice(0, 8) : []);

    if (jugadoresParaCuartos.length !== 8) {
      // If not exactly 8, consider if it's a 5-player scenario leading straight to semis
      if (clasificados.length === 4) { // This implies generarEliminatorias already gave us semifinalists
        return res.redirect("/semifinales"); // Redirect directly to semifinals
      }
      return res.status(400).send("Debe haber exactamente 8 jugadores clasificados para los Cuartos de Final o 4 para Semifinales directas.");
    }
    res.render("cuartos", { clasificados: jugadoresParaCuartos });
  } catch (error) {
    console.error("Error al generar cuartos:", error.message);
    res.status(500).send("Error al generar los cuartos de final: " + error.message);
  }
});

router.post("/cuartos", async (req, res) => {
  try {
    const cuartosDefinidosPorAdmin = [
      { id: 1, localId: parseInt(req.body.local1), visitanteId: parseInt(req.body.visitante1) },
      { id: 2, localId: parseInt(req.body.local2), visitanteId: parseInt(req.body.visitante2) },
      { id: 3, localId: parseInt(req.body.local3), visitanteId: parseInt(req.body.visitante3) },
      { id: 4, localId: parseInt(req.body.local4), visitanteId: parseInt(req.body.visitante4) },
    ];

    const cuartosMatchups = await integrantescontrollers.generarCuartosDeFinal(cuartosDefinidosPorAdmin);

    cuartosResultados = [];
    cuartosMatchups.forEach((c) => {
      const golesLocal = parseInt(req.body[`goles_local_cuartos_${c.id}`]);
      const golesVisitante = parseInt(req.body[`goles_visitante_cuartos_${c.id}`]);

      let ganador;
      if (golesLocal > golesVisitante) {
        ganador = c.local;
      } else if (golesVisitante > golesLocal) {
        ganador = c.visitante;
      } else {
        // --- LÓGICA DE DESEMPATE POR PENALES ---
        console.log(`Empate en cuartos entre ${c.local.nombre} y ${c.visitante.nombre}. Definiendo por penales.`);

        const penalesLocal = parseInt(req.body[`penales_local_cuartos_${c.id}`]);
        const penalesVisitante = parseInt(req.body[`penales_visitante_cuartos_${c.id}`]);

        // Se determina el ganador por penales. Asumimos que no hay empate en penales.
        if (penalesLocal > penalesVisitante) {
          ganador = c.local;
        } else { // Si empatan en penales o gana el visitante, se le da la victoria al visitante
          ganador = c.visitante;
        }
      }

      cuartosResultados.push({
        local: c.local,
        visitante: c.visitante,
        golesLocal,
        golesVisitante,
        ganador // El ganador del partido
      });
    });
    res.redirect("/semifinales");
  } catch (error) {
    console.error("Error al procesar cuartos:", error.message);
    res.status(500).send("Error al procesar los cuartos de final: " + error.message);
  }
});

router.get("/semifinales", async (req, res) => {
  let semifinales;
  try {
    if (cuartosResultados.length === 4) { // If coming from quarterfinals
      const ganadoresCuartos = cuartosResultados.map(c => c.ganador);
      // This method should take the 4 winners and set up the semi-final matches (e.g., winner QF1 vs winner QF4, winner QF2 vs winner QF3)
      semifinales = await integrantescontrollers.generarSemifinalesDesdeCuartos(ganadoresCuartos);
    } else { // Logic for direct semifinals if no quarters were played
      // This is where the 1 phase, 5 players logic comes in from generarEliminatorias
      const { clasificados, semifinales: directSemifinals } = await integrantescontrollers.generarEliminatorias();

      if (directSemifinals && directSemifinals.length === 2) {
        // If generarEliminatorias already provided the semifinal matchups (like for 1 phase, 5 players)
        semifinales = directSemifinals;
      } else if (clasificados && clasificados.length === 4) {
        // If generarEliminatorias returned 4 classified players, but no direct semifinal matchups
        // This implies you need a default pairing for 4 players (e.g., 1st vs 4th, 2nd vs 3rd)
        semifinales = await integrantescontrollers.generarSemifinalesDirectas(clasificados);
      } else {
        console.warn("Número de clasificados inesperado para semifinales directas:", clasificados ? clasificados.length : 0);
        return res.status(400).send("No hay suficientes jugadores clasificados para semifinales directas.");
      }
    }
    // Ensure semifinales array has 2 matches before rendering
    if (!semifinales || semifinales.length !== 2) {
      return res.status(400).send("Error: No se pudieron generar las dos semifinales correctamente.");
    }
    res.render("semifinales", { semifinales });
  } catch (error) {
    console.error("Error al generar semifinales:", error.message);
    res.status(500).send("Error al generar las semifinales: " + error.message);
  }
});

router.post("/semifinales", async (req, res) => {
  let semifinalesMatchups; // Rename to avoid conflict
  try {
    if (cuartosResultados.length === 4) {
      const ganadoresCuartos = cuartosResultados.map(c => c.ganador);
      semifinalesMatchups = await integrantescontrollers.generarSemifinalesDesdeCuartos(ganadoresCuartos);
    } else {
      const { clasificados, semifinales: directSemifinals } = await integrantescontrollers.generarEliminatorias();
      if (directSemifinals && directSemifinals.length === 2) {
        semifinalesMatchups = directSemifinals;
      } else if (clasificados && clasificados.length === 4) {
        semifinalesMatchups = await integrantescontrollers.generarSemifinalesDirectas(clasificados);
      } else {
        console.error("Error: No hay 4 clasificados directos para semifinales en POST.");
        return res.status(400).send("No se pudo generar las semifinales directamente.");
      }
    }

    // Process form results
    semifinalesResultados = [];

    semifinalesMatchups.forEach((s, i) => { // Use semifinalesMatchups here
      const golesLocal = parseInt(req.body[`goles_local_${i}`]);
      const golesVisitante = parseInt(req.body[`goles_visitante_${i}`]);

      let ganador;
      if (golesLocal > golesVisitante) {
        ganador = s.local;
      } else if (golesVisitante > golesLocal) {
        ganador = s.visitante;
      } else {
        // --- LÓGICA DE DESEMPATE POR PENALES ---
        console.log(`Empate en semifinales entre ${s.local.nombre} y ${s.visitante.nombre}. Definiendo por penales.`);

        const penalesLocal = parseInt(req.body[`penales_local_${i}`]);
        const penalesVisitante = parseInt(req.body[`penales_visitante_${i}`]);

        if (penalesLocal > penalesVisitante) {
          ganador = s.local;
        } else {
          ganador = s.visitante;
        }
      }

      semifinalesResultados.push({
        local: s.local,
        visitante: s.visitante,
        golesLocal,
        golesVisitante,
        ganador
      });
    });

    res.redirect("/final");
  } catch (error) {
    console.error("Error al procesar semifinales:", error.message);
    res.status(500).send("Error al procesar las semifinales: " + error.message);
  }
});


// --- Routes for Final and Champion ---

router.get("/final", (req, res) => {
  // Ensure we have exactly two winners from semifinals to proceed to final
  if (semifinalesResultados.length !== 2 || !semifinalesResultados[0].ganador || !semifinalesResultados[1].ganador) {
    return res.redirect("/semifinales"); // Redirect back if not ready
  }

  const finalistas = semifinalesResultados.map(p => p.ganador);
  res.render("final", { finalistas });
});

router.post("/final", (req, res) => {
  // Make sure finalistas exist before trying to access them
  if (semifinalesResultados.length !== 2 || !semifinalesResultados[0].ganador || !semifinalesResultados[1].ganador) {
    console.error("Error: Semifinal results are not valid for final.");
    return res.status(400).send("No se pudieron determinar los finalistas.");
  }

  const goles1 = parseInt(req.body.goles1);
  const goles2 = parseInt(req.body.goles2);

  // Assuming semifinalesResultados[0].ganador and [1].ganador are the two finalists
  let ganadorFinal;
  if (goles1 > goles2) {
    ganadorFinal = semifinalesResultados[0].ganador;
  } else if (goles2 > goles1) {
    ganadorFinal = semifinalesResultados[1].ganador;
  } else {
    // --- LÓGICA DE DESEMPATE POR PENALES ---
    console.log(`Empate en la final. Definiendo por penales.`);

    const penales1 = parseInt(req.body.penales1);
    const penales2 = parseInt(req.body.penales2);

    if (penales1 > penales2) {
      ganadorFinal = semifinalesResultados[0].ganador;
    } else {
      ganadorFinal = semifinalesResultados[1].ganador;
    }
  }

  finalResultado = {
    jugador1: semifinalesResultados[0].ganador,
    jugador2: semifinalesResultados[1].ganador,
    goles1,
    goles2,
    ganador: ganadorFinal
  };

  res.redirect("/campeon");
});

router.get("/campeon", (req, res) => {
  if (!finalResultado || !finalResultado.ganador) {
    return res.redirect("/final"); // Redirect back if champion not determined
  }
  res.render("campeon", { ganador: finalResultado.ganador });
});

// --- General API/Utility Routes ---

router.post("/integrantes/sumar-puntos/:id", async (req, res) => {
  const { puntos } = req.body;
  const id = parseInt(req.params.id);
  // Ensure your controller has this method to update points for a specific player
  await integrantescontrollers.sumarPuntos(id, parseInt(puntos));
  res.redirect("/home");
});

// MODIFIED ROUTE: Updated to accept JSON body and handle calculated stats
router.post("/integrantes/actualizar-estadisticas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // The frontend now sends all calculated stats in the request body
  const { pj, pg, pe, pp, gf, gc, dg, pts } = req.body;

  const data = {
    partidos_jugados: parseInt(pj),
    partidos_ganados: parseInt(pg),
    partidos_empatados: parseInt(pe),
    partidos_perdidos: parseInt(pp),
    goles_a_favor: parseInt(gf),
    goles_en_contra: parseInt(gc),
    diferencia_goles: parseInt(dg), // Include DG as it's calculated on frontend
    puntos: parseInt(pts)           // Include PTS as it's calculated on frontend
  };

  try {
    await integrantescontrollers.actualizarEstadisticas(id, data);
    res.status(200).json({ message: "Estadísticas actualizadas correctamente." }); // Send JSON response
  } catch (error) {
    console.error("Error al actualizar estadísticas:", error.message);
    res.status(500).json({ message: "Error al actualizar estadísticas: " + error.message }); // Send JSON error
  }
});

router.post("/integrantes/eliminar-fase/:fase", async (req, res) => {
  const fase = parseInt(req.params.fase);
  await integrantescontrollers.eliminarFase(fase);
  res.redirect("/home");
});

router.post("/integrantes/crear-fases", async (req, res) => {
  try {
    await integrantescontrollers.crearFases(req.body);
    res.redirect("/home");
  } catch (error) {
    console.error("Error al crear fases:", error.message);
    res.status(500).send("Error al crear fases");
  }
});

// --- Home and Misc Routes ---

// Consolidated /home GET route to avoid conflicts and ensure correct data rendering
router.get("/home", async (req, res) => {
  try {
    const fases = await integrantescontrollers.obtenerFases();
    res.render("index", { fases });
  } catch (error) {
    console.error("Error al cargar home:", error.message);
    res.render("index", { fases: [], error: "Error al cargar fases" });
  }
});

router.get("/ruleta", (req, res) => res.render("ruleta"));
router.get("/copa", (req, res) => res.render("eliminatorias"));
module.exports = router;