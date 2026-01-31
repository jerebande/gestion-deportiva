-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-01-2026 a las 09:49:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pescado`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campeonatos`
--

CREATE TABLE `campeonatos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fase_inicio` enum('cuartos','semifinal','final') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `competidores`
--

CREATE TABLE `competidores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `division` char(1) DEFAULT 'B',
  `foto` varchar(255) DEFAULT 'default-avatar.png',
  `copas_liga` int(11) DEFAULT 0,
  `trofeos` int(11) DEFAULT 0,
  `medallas` int(11) DEFAULT 0,
  `segundos_puestos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `competidores`
--

INSERT INTO `competidores` (`id`, `nombre`, `division`, `foto`, `copas_liga`, `trofeos`, `medallas`, `segundos_puestos`) VALUES
(10, 'jeremias bandeli', 'A', 'foto_file-1755211456263-810043757.jpg', 0, 6, 5, 7),
(13, 'ariel bandelli', 'A', 'foto_file-1755225124612-615560883.webp', 1, 2, 7, 3),
(14, 'maximo alcazar', 'B', 'foto_file-1755225498403-709543602.png', 0, 0, 1, 8),
(15, 'jonas poelstra', 'B', 'npc.webp', 0, 1, 1, 4),
(16, 'alex neyra', 'B', 'npc.webp', 0, 1, 1, 0),
(18, 'leon bandelli', 'A', 'foto_file-1755226375505-146307021.png', 0, 0, 0, 2),
(19, 'juan pablo mahron', 'A', 'foto_file-1755226701225-717319101.png', 0, 0, 0, 0),
(21, 'franco marhon', 'B', 'foto_file-1755318654990-498628968.jpeg', 0, 0, 0, 0),
(23, 'amadeo caballo', 'B', 'foto_file-1760214590309-846107238.png', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `config_liga`
--

CREATE TABLE `config_liga` (
  `id` int(11) NOT NULL,
  `num_descensos` int(11) NOT NULL DEFAULT 1,
  `num_promociones` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `config_liga`
--

INSERT INTO `config_liga` (`id`, `num_descensos`, `num_promociones`) VALUES
(1, 1, 1),
(2, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estatisticas`
--

CREATE TABLE `estatisticas` (
  `id` int(11) NOT NULL,
  `partidos_jugados` int(11) DEFAULT 0,
  `partidos_ganados` int(11) DEFAULT 0,
  `partidos_empatados` int(11) DEFAULT 0,
  `partidos_perdidos` int(11) DEFAULT 0,
  `goles_a_favor` int(11) DEFAULT 0,
  `goles_en_contra` int(11) DEFAULT 0,
  `diferencia_goles` int(11) DEFAULT 0,
  `puntos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estatisticas`
--

INSERT INTO `estatisticas` (`id`, `partidos_jugados`, `partidos_ganados`, `partidos_empatados`, `partidos_perdidos`, `goles_a_favor`, `goles_en_contra`, `diferencia_goles`, `puntos`) VALUES
(10, 0, 0, 0, 0, 0, 0, 0, 0),
(13, 0, 0, 0, 0, 0, 0, 0, 0),
(14, 0, 0, 0, 0, 0, 0, 0, 0),
(15, 0, 0, 0, 0, 0, 0, 0, 0),
(16, 0, 0, 0, 0, 0, 0, 0, 0),
(18, 0, 0, 0, 0, 0, 0, 0, 0),
(19, 0, 0, 0, 0, 0, 0, 0, 0),
(21, 0, 0, 0, 0, 0, 0, 0, 0),
(23, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fase` int(11) DEFAULT NULL,
  `puntos` int(11) DEFAULT 0,
  `partidos_jugados` int(11) DEFAULT 0,
  `partidos_ganados` int(11) DEFAULT 0,
  `partidos_empatados` int(11) DEFAULT 0,
  `partidos_perdidos` int(11) DEFAULT 0,
  `goles_a_favor` int(11) DEFAULT 0,
  `goles_en_contra` int(11) DEFAULT 0,
  `diferencia_goles` int(11) DEFAULT 0,
  `campeonato_id` int(11) DEFAULT NULL,
  `division` varchar(1) NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id`, `nombre`, `fase`, `puntos`, `partidos_jugados`, `partidos_ganados`, `partidos_empatados`, `partidos_perdidos`, `goles_a_favor`, `goles_en_contra`, `diferencia_goles`, `campeonato_id`, `division`) VALUES
(716, 'jere', 1, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(717, 'maxi', 1, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(718, 'juan', 1, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(719, 'franco', 1, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(720, 'neya', 2, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(721, 'jonas', 2, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(722, 'lecon', 2, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A'),
(723, 'larry', 2, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 'A');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores_campeonato`
--

CREATE TABLE `jugadores_campeonato` (
  `id` int(11) NOT NULL,
  `campeonato_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores_eliminacion`
--

CREATE TABLE `jugadores_eliminacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `puntos` int(11) DEFAULT 0,
  `goles_a_favor` int(11) DEFAULT 0,
  `goles_en_contra` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores_eliminacion`
--

INSERT INTO `jugadores_eliminacion` (`id`, `nombre`, `puntos`, `goles_a_favor`, `goles_en_contra`) VALUES
(44, 's', 0, 0, 0),
(45, 'jere', 0, 0, 0),
(46, 'frasco', 0, 0, 0),
(47, 'franco', 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores_liga`
--

CREATE TABLE `jugadores_liga` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `liga` int(11) NOT NULL COMMENT '1 = Liga A, 2 = Liga B',
  `partidos_jugados` int(11) NOT NULL DEFAULT 0,
  `partidos_ganados` int(11) NOT NULL DEFAULT 0,
  `partidos_empatados` int(11) NOT NULL DEFAULT 0,
  `partidos_perdidos` int(11) NOT NULL DEFAULT 0,
  `goles_a_favor` int(11) NOT NULL DEFAULT 0,
  `goles_en_contra` int(11) NOT NULL DEFAULT 0,
  `diferencia_goles` int(11) NOT NULL DEFAULT 0,
  `puntos` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `liga_participantes`
--

CREATE TABLE `liga_participantes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `division` char(1) DEFAULT 'B',
  `foto` varchar(255) DEFAULT 'default-avatar.png',
  `copas_liga` int(11) DEFAULT 0,
  `trofeos` int(11) DEFAULT 0,
  `medallas` int(11) DEFAULT 0,
  `segundos_puestos` int(11) DEFAULT 0,
  `partidos_jugados` int(11) DEFAULT 0,
  `partidos_ganados` int(11) DEFAULT 0,
  `partidos_empatados` int(11) DEFAULT 0,
  `partidos_perdidos` int(11) DEFAULT 0,
  `goles_a_favor` int(11) DEFAULT 0,
  `goles_en_contra` int(11) DEFAULT 0,
  `diferencia_goles` int(11) DEFAULT 0,
  `puntos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `liga_participantes`
--

INSERT INTO `liga_participantes` (`id`, `nombre`, `division`, `foto`, `copas_liga`, `trofeos`, `medallas`, `segundos_puestos`, `partidos_jugados`, `partidos_ganados`, `partidos_empatados`, `partidos_perdidos`, `goles_a_favor`, `goles_en_contra`, `diferencia_goles`, `puntos`) VALUES
(10, 'jeremías Agustín', 'A', 'default-avatar.png', 1, 2, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0),
(11, 'maxi', 'B', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(12, 'juan', 'A', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(18, 'larry', 'A', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(19, 'lecon', 'A', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(20, 'franco', 'B', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(21, 'neyra', 'B', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(22, 'jomas', 'B', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(23, 'amadeo', 'B', 'default-avatar.png', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participantes`
--

CREATE TABLE `participantes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(10) NOT NULL,
  `trofeos` int(11) DEFAULT 0,
  `medallas` int(11) DEFAULT 0,
  `segundos_puestos` int(11) DEFAULT 0,
  `copas_liga` int(11) DEFAULT 0,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

CREATE TABLE `partidos` (
  `id` int(11) NOT NULL,
  `local_id` int(11) NOT NULL,
  `visitante_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `goles_local` int(11) DEFAULT NULL,
  `goles_visitante` int(11) DEFAULT NULL,
  `jugado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidosliga`
--

CREATE TABLE `partidosliga` (
  `id` int(11) NOT NULL,
  `jugador_local_id` int(11) NOT NULL,
  `jugador_visitante_id` int(11) NOT NULL,
  `goles_local` int(11) DEFAULT NULL,
  `goles_visitante` int(11) DEFAULT NULL,
  `fecha_partido` datetime DEFAULT current_timestamp(),
  `division` varchar(1) NOT NULL,
  `temporada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `torneos`
--

CREATE TABLE `torneos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fase_inicial` enum('cuartos','semifinal','final') NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `campeonatos`
--
ALTER TABLE `campeonatos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `competidores`
--
ALTER TABLE `competidores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `config_liga`
--
ALTER TABLE `config_liga`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `estatisticas`
--
ALTER TABLE `estatisticas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `jugadores_campeonato`
--
ALTER TABLE `jugadores_campeonato`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campeonato_id` (`campeonato_id`);

--
-- Indices de la tabla `jugadores_eliminacion`
--
ALTER TABLE `jugadores_eliminacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `jugadores_liga`
--
ALTER TABLE `jugadores_liga`
  ADD PRIMARY KEY (`id`),
  ADD KEY `liga` (`liga`);

--
-- Indices de la tabla `liga_participantes`
--
ALTER TABLE `liga_participantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `participantes`
--
ALTER TABLE `participantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `local_id` (`local_id`),
  ADD KEY `visitante_id` (`visitante_id`),
  ADD KEY `jugado` (`jugado`);

--
-- Indices de la tabla `partidosliga`
--
ALTER TABLE `partidosliga`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugador_local_id` (`jugador_local_id`),
  ADD KEY `jugador_visitante_id` (`jugador_visitante_id`);

--
-- Indices de la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `campeonatos`
--
ALTER TABLE `campeonatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `competidores`
--
ALTER TABLE `competidores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `config_liga`
--
ALTER TABLE `config_liga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=724;

--
-- AUTO_INCREMENT de la tabla `jugadores_campeonato`
--
ALTER TABLE `jugadores_campeonato`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jugadores_eliminacion`
--
ALTER TABLE `jugadores_eliminacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `jugadores_liga`
--
ALTER TABLE `jugadores_liga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `liga_participantes`
--
ALTER TABLE `liga_participantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `participantes`
--
ALTER TABLE `participantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `partidos`
--
ALTER TABLE `partidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `partidosliga`
--
ALTER TABLE `partidosliga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `torneos`
--
ALTER TABLE `torneos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estatisticas`
--
ALTER TABLE `estatisticas`
  ADD CONSTRAINT `estatisticas_ibfk_1` FOREIGN KEY (`id`) REFERENCES `competidores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `jugadores_campeonato`
--
ALTER TABLE `jugadores_campeonato`
  ADD CONSTRAINT `jugadores_campeonato_ibfk_1` FOREIGN KEY (`campeonato_id`) REFERENCES `campeonatos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD CONSTRAINT `partidos_ibfk_1` FOREIGN KEY (`local_id`) REFERENCES `jugadores_liga` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `partidos_ibfk_2` FOREIGN KEY (`visitante_id`) REFERENCES `jugadores_liga` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `partidosliga`
--
ALTER TABLE `partidosliga`
  ADD CONSTRAINT `partidosliga_ibfk_1` FOREIGN KEY (`jugador_local_id`) REFERENCES `jugadores` (`id`),
  ADD CONSTRAINT `partidosliga_ibfk_2` FOREIGN KEY (`jugador_visitante_id`) REFERENCES `jugadores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
