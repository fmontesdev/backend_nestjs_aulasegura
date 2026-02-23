-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: database
-- Tiempo de generación: 23-02-2026 a las 07:58:44
-- Versión del servidor: 11.4.5-MariaDB
-- Versión de PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aulasegura`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `academic_year`
--

CREATE TABLE `academic_year` (
  `academic_year_id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `academic_year`
--

INSERT INTO `academic_year` (`academic_year_id`, `code`, `is_active`) VALUES
(1, '2023-2024', 0),
(2, '2024-2025', 0),
(3, '2025-2026', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `academic_year_course`
--

CREATE TABLE `academic_year_course` (
  `academic_year_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `academic_year_course`
--

INSERT INTO `academic_year_course` (`academic_year_id`, `course_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 26),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 26),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15),
(3, 16),
(3, 17),
(3, 18),
(3, 19),
(3, 20),
(3, 21),
(3, 22),
(3, 23),
(3, 24),
(3, 26),
(3, 27),
(3, 28),
(3, 29);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `access_log`
--

CREATE TABLE `access_log` (
  `access_log_id` int(11) NOT NULL,
  `tag_id` int(11) DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  `reader_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `subject_id` bigint(20) DEFAULT NULL,
  `access_method` enum('rfid','nfc','qr') NOT NULL,
  `access_status` enum('allowed','denied','exit','timeout') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `access_log`
--

INSERT INTO `access_log` (`access_log_id`, `tag_id`, `user_id`, `reader_id`, `room_id`, `subject_id`, `access_method`, `access_status`, `created_at`) VALUES
(1, 7, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', 24, 24, NULL, 'nfc', 'denied', '2025-11-24 11:55:07'),
(2, 2, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', 24, 24, NULL, 'nfc', 'denied', '2025-11-24 11:55:24'),
(3, 7, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', 24, 24, NULL, 'rfid', 'denied', '2025-11-24 11:56:10'),
(4, 7, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', 24, 24, NULL, 'rfid', 'denied', '2025-11-24 11:56:26'),
(5, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 1, NULL, 'qr', 'denied', '2025-11-24 12:55:50'),
(6, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 1, NULL, 'qr', 'allowed', '2025-11-24 14:48:29'),
(7, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 1, NULL, 'qr', 'allowed', '2025-11-24 14:48:36'),
(8, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 1, NULL, 'qr', 'allowed', '2025-11-24 15:19:07'),
(9, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 1, NULL, 'qr', 'denied', '2025-11-24 18:23:37'),
(10, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 8, 8, NULL, 'qr', 'allowed', '2025-11-24 18:24:07'),
(11, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 36, 36, NULL, 'qr', 'allowed', '2025-11-27 15:50:38'),
(12, NULL, '6b86f7e7-bf19-4117-b262-a1221c4ced55', 36, 36, NULL, 'qr', 'allowed', '2025-11-27 15:50:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blacklist_token`
--

CREATE TABLE `blacklist_token` (
  `user_id` char(36) NOT NULL,
  `token` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `blacklist_token`
--

INSERT INTO `blacklist_token` (`user_id`, `token`, `created_at`, `expires_at`) VALUES
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4Mjk5OCwiZXhwIjoxNzcyMzg3Nzk4fQ.Out8-8yMi7A6Fis74fNgcttJbbP8Kiq8dPEWUkr26qg', '2026-02-22 18:56:38', '2026-03-01 18:56:38'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzA0MSwiZXhwIjoxNzcyMzg3ODQxfQ.BMbEN1pGDhdNlqLE3JlsET3xWrVrENNjYFC8DhWMUmA', '2026-02-22 18:57:21', '2026-03-01 18:57:21'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzA0NSwiZXhwIjoxNzcyMzg3ODQ1fQ.dK8mgdfO2VsAUnmchXxBtXXlBzjUae2z5Ijq41z0tPo', '2026-02-22 18:57:25', '2026-03-01 18:57:25'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzA1MCwiZXhwIjoxNzcyMzg3ODUwfQ.uwpDhFPQP3Vcvz7NXGyw2QxmqZCTAxr_63K9vvFNYsk', '2026-02-22 18:57:30', '2026-03-01 18:57:30'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzA1NSwiZXhwIjoxNzcyMzg3ODU1fQ.3bpaFg6ShU8u-rAkJ7yuDtj5EzNzC-kBh14aFHPEa_A', '2026-02-22 18:57:35', '2026-03-01 18:57:35'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAwNCwiZXhwIjoxNzcyMzg3ODA0fQ.HdeEb17idAq85Q0YuR7AhWXyTOL3WrtgzAjvFKL0NOg', '2026-02-22 18:56:44', '2026-03-01 18:56:44'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAxMCwiZXhwIjoxNzcyMzg3ODEwfQ.mTPpVMOly1--LsvTsXcrxqWyiiYxd0_CmYR1P1IYsJI', '2026-02-22 18:56:50', '2026-03-01 18:56:50'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAxNSwiZXhwIjoxNzcyMzg3ODE1fQ.tR3a42ZL8-PwzbhgMwOe2KrI8d6lrzTGy1JegdLgmGs', '2026-02-22 18:56:55', '2026-03-01 18:56:55'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAyMCwiZXhwIjoxNzcyMzg3ODIwfQ.hX3e6ehjMexyNve_t7jmIAe-xSg7EEr_s7xmuspDduU', '2026-02-22 18:57:00', '2026-03-01 18:57:00'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAyNCwiZXhwIjoxNzcyMzg3ODI0fQ.1QDDWeiDLaxOEkItDiFXYo2qWd0yMuc_R3hUrqk5V5A', '2026-02-22 18:57:04', '2026-03-01 18:57:04'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAyOSwiZXhwIjoxNzcyMzg3ODI5fQ.xC-QsgwYMdFE9gM0Ycb3JRCYmUb53oaLPHWLwR72sao', '2026-02-22 18:57:09', '2026-03-01 18:57:09'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzAzNywiZXhwIjoxNzcyMzg3ODM3fQ.CkOOikv3b70RX-Hj4FCbjEPCxN3W2Pri7tezZAOGrP8', '2026-02-22 18:57:17', '2026-03-01 18:57:17'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzI0NSwiZXhwIjoxNzcyMzg4MDQ1fQ.8NsmG9I77YxSAwADlW-Ieu2SE24RGFBwBZX4F4n6UcM', '2026-02-22 19:00:45', '2026-03-01 19:00:45'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzI1MCwiZXhwIjoxNzcyMzg4MDUwfQ.fdCMOnjAG7gGAu-0wrM0Q3bbsBS87ByFfw39RzrzvdA', '2026-02-22 19:00:50', '2026-03-01 19:00:50'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzI1NSwiZXhwIjoxNzcyMzg4MDU1fQ.KVwp3VcFytns6qJtw-dliE-AuIv9t8koYLc_DakhQqM', '2026-02-22 19:00:55', '2026-03-01 19:00:55'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzM0OSwiZXhwIjoxNzcyMzg4MTQ5fQ.DQHqWXr5ilYIHV4rG0gH7-9Ko3O9dWU6jzqL_FXEffA', '2026-02-22 19:02:29', '2026-03-01 19:02:29'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzM1NCwiZXhwIjoxNzcyMzg4MTU0fQ.zvpwDM4X90-TVGjk7IN7ubiMHIvm4B7JvwznGiWoWV0', '2026-02-22 19:02:34', '2026-03-01 19:02:34'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzMxNSwiZXhwIjoxNzcyMzg4MTE1fQ.mblhY4yoUB0yX8xsKQv22O9uAKmclVpCQpKNy6KHNJY', '2026-02-22 19:01:55', '2026-03-01 19:01:55'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzMxOSwiZXhwIjoxNzcyMzg4MTE5fQ.4TyRusRi7fMwbl_Z0oO59lTQZPM_-9y_soRJ2fej5Q0', '2026-02-22 19:01:59', '2026-03-01 19:01:59'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzMyNSwiZXhwIjoxNzcyMzg4MTI1fQ.f8x8IRRP15zRwD2WXzsvaSkNZc-KFLMxwsTAt7Cq9L4', '2026-02-22 19:02:05', '2026-03-01 19:02:05'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzMzNywiZXhwIjoxNzcyMzg4MTM3fQ.BtMKenEz2trlRK9lQz9CLg8n7rx7aqdnbCem5u5c9Y8', '2026-02-22 19:02:17', '2026-03-01 19:02:17'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzQ5OCwiZXhwIjoxNzcyMzg4Mjk4fQ.VQLV3CTJTp1Umk6DSSpgTvxWXdmUe8wPybYTG2asUaE', '2026-02-22 19:04:58', '2026-03-01 19:04:58'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzU5MCwiZXhwIjoxNzcyMzg4MzkwfQ.015sisHKLvepnkOM3pENhkKcEzMxPh6w0G26uxgOB_Y', '2026-02-22 19:06:30', '2026-03-01 19:06:30'),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTFmY2YxOS02Y2JjLTRkMzAtYmU5Zi01OWYzMzdjNjMzYTUiLCJlbWFpbCI6Imphbml0b3JAZ3ZhLmVzIiwicm9sZXMiOlsiamFuaXRvciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc4MzU5NSwiZXhwIjoxNzcyMzg4Mzk1fQ.N-MmseF9kBvJ-dMjsPZBofX3xFHESGRGIZPeHOYJSIY', '2026-02-22 19:06:35', '2026-03-01 19:06:35'),
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZDljZTJlMC1iMTcyLTQ3NTYtOGM5Mi1jNjQ3ZTNmMGE2NDkiLCJlbWFpbCI6ImFkbWluQGd2YS5lcyIsInJvbGVzIjpbImFkbWluIiwidGVhY2hlciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MDA0NzU3OSwiZXhwIjoxNzcwNjUyMzc5fQ.IdfYNpy7tFKs6VHXf-bOy0kyFC-pUDymS8T0mbHV--Y', '2026-02-02 17:04:54', '2026-02-09 16:52:59'),
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZDljZTJlMC1iMTcyLTQ3NTYtOGM5Mi1jNjQ3ZTNmMGE2NDkiLCJlbWFpbCI6ImFkbWluQGd2YS5lcyIsInJvbGVzIjpbImFkbWluIiwidGVhY2hlciJdLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MTc3NjE0NSwiZXhwIjoxNzcyMzgwOTQ1fQ.xvOKgQ92WE7sAEiFBjXdqANb0bI2GfA73cdovvm6dYk', '2026-02-22 18:55:57', '2026-03-01 17:02:25'),
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZDljZTJlMC1iMTcyLTQ3NTYtOGM5Mi1jNjQ3ZTNmMGE2NDkiLCJlbWFpbCI6ImFkbWluQGd2YS5lcyIsInJvbGVzIjpbImFkbWluIl0sInRva2VuVmVyc2lvbiI6MywiaWF0IjoxNzY5OTM3NDE5LCJleHAiOjE3NzA1NDIyMTl9.r4e9xHMntihWEjzT-ojWx1S23uM0g_AccPrV-LoK5-w', '2026-02-02 16:51:40', '2026-02-08 10:16:59'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5MjAyMywiZXhwIjoxNzY2MDk2ODIzfQ.h6JEFQs6_TLc1E2Y8Ceack17DicyU1p4QHqKYFzMGj8', '2025-12-11 23:49:30', '2025-12-18 23:27:03'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5MzM4OSwiZXhwIjoxNzY2MDk4MTg5fQ.fq6ij-vyBfdsC1e9lQq04ZmacOGZH3oTBEeV2X_OJI0', '2025-12-11 23:51:08', '2025-12-18 23:49:49'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5MzQ5OCwiZXhwIjoxNzY2MDk4Mjk4fQ.DMkRU9IQhjG2n5HyA22Hc18WqqvNWctouXWH4gSAsgs', '2025-12-12 00:02:17', '2025-12-18 23:51:38'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5NDczNSwiZXhwIjoxNzY2MDk5NTM1fQ.xVzcIjpby9wIv3fU3btpDP4AiGux1IYfQIgkIGYVsKQ', '2025-12-12 00:25:57', '2025-12-19 00:12:15'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5NDE4MSwiZXhwIjoxNzY2MDk4OTgxfQ.xHniA4QTiCImNq8A_72opP-B_HG114PnmUCy52_sz1I', '2025-12-12 00:09:58', '2025-12-19 00:03:01'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5NjI4OCwiZXhwIjoxNzY2MTAxMDg4fQ.SG2EfQpYkAfM053wEoQzJbCb0tCaXgIbh_My0aHQwYA', '2025-12-12 00:38:26', '2025-12-19 00:38:08'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5NTEwOCwiZXhwIjoxNzY2MDk5OTA4fQ.oxkPiHJjRAl8__dgZVfbgCUXZBlCWb3-3979ezTRIIg', '2025-12-12 12:19:46', '2025-12-19 00:18:28'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTQ5ODUxMCwiZXhwIjoxNzY2MTAzMzEwfQ.MfrfZ1-Pt-lqXctb8ORjpPWBEOM0VQfU5XPStS3yrbY', '2025-12-12 01:15:15', '2025-12-19 01:15:10'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTU0NDc1NywiZXhwIjoxNzY2MTQ5NTU3fQ.cqG7YVb0zgyR9Hr3Zvk7g05lPMS6o2q2zWFEJERv7zk', '2025-12-12 19:13:18', '2025-12-19 14:05:57'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2NTU2MzIxMCwiZXhwIjoxNzY2MTY4MDEwfQ.b3G2b-X2B9uxt8WdrScz9KR3XJSKGFgmGk7T114tpqI', '2025-12-12 19:34:32', '2025-12-19 19:13:30'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2OTc3MTI0MywiZXhwIjoxNzcwMzc2MDQzfQ.6JhMcCSWiUy_uA_n3pPNN4dKxv1TjAU0lFVrp6Ns_gg', '2026-01-30 12:09:06', '2026-02-06 12:07:23'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2OTc3MTM1OCwiZXhwIjoxNzcwMzc2MTU4fQ.YUR5Ag2icbcBHXh22fKBGA5MRFCHTcr8dMPawvlcpgw', '2026-01-30 14:44:47', '2026-02-06 12:09:18'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2OTc4MDc1MiwiZXhwIjoxNzcwMzg1NTUyfQ.FQ57drVI7Do2GvuARNnJJFmTxavogPQeoZS3te7ePyA', '2026-01-31 22:06:49', '2026-02-06 14:45:52'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2OTc4MDcyOCwiZXhwIjoxNzcwMzg1NTI4fQ.cTnldNeEg91YKavA1C1qe8Tfog7M2q5-Ge-bsmmmCJw', '2026-01-30 14:45:33', '2026-02-06 14:45:28'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2OTg5MzczNCwiZXhwIjoxNzcwNDk4NTM0fQ.x87DkW8-YMZu83UTi-pFDTJ-KPTnTNZZz13WH6Kfp4c', '2026-01-31 22:08:58', '2026-02-07 22:08:54'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTcsImlhdCI6MTc2OTg5NDk1NywiZXhwIjoxNzcwNDk5NzU3fQ.4BZtEcFijqRb224hz2dF0Vea3g7TiikbpXKf01tL4SA', '2026-02-01 10:16:16', '2026-02-07 22:29:17'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTUsImlhdCI6MTc2Mzk4NzU2NSwiZXhwIjoxNzY0NTkyMzY1fQ.b_yczuA2UsMFjALDTIwoDcKr30EEsDn-D8mOIlMFl6M', '2025-11-24 16:23:37', '2025-12-01 13:32:45'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTUsImlhdCI6MTc2Mzk5Nzg4MSwiZXhwIjoxNzY0NjAyNjgxfQ.J0WwszPdHZ2ib1ib5f1Jj7ViCRRSa6NF5hYZUx5-He4', '2025-11-24 19:15:57', '2025-12-01 16:24:41'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTUsImlhdCI6MTc2NDAwODI3MSwiZXhwIjoxNzY0NjEzMDcxfQ.FTWi-cB5ztWRxPN0cJhzr4xlXKHyLCZc1uSDPZP0n9g', '2025-11-24 19:30:13', '2025-12-01 19:17:51'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTUsImlhdCI6MTc2NDAwOTAzOCwiZXhwIjoxNzY0NjEzODM4fQ.NzWxFq1lneWwLbi6IImkTm4j8NAqfWgkYbkRSUV_HoE', '2025-11-24 19:30:44', '2025-12-01 19:30:38'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTUsImlhdCI6MTc2NDAwOTE0NSwiZXhwIjoxNzY0NjEzOTQ1fQ.6I9m1er6WKYBMSXI0NybQ2BqPwUImanVuD-1Zsm7c6g', '2025-11-24 19:33:37', '2025-12-01 19:32:25'),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Yjg2ZjdlNy1iZjE5LTQxMTctYjI2Mi1hMTIyMWM0Y2VkNTUiLCJlbWFpbCI6InBhZ2Fkb0BndmEuZXMiLCJyb2xlcyI6WyJ0ZWFjaGVyIl0sInRva2VuVmVyc2lvbiI6MTYsImlhdCI6MTc2NDI1NTQ5OSwiZXhwIjoxNzY0ODYwMjk5fQ.91_YlqNOXxPHBEzF8jmfyGubXCyXH_YNLKto9dWQkdI', '2025-11-27 16:12:46', '2025-12-04 15:58:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `course`
--

CREATE TABLE `course` (
  `course_id` int(11) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `education_stage` enum('ESO','bachillerato','CF') NOT NULL,
  `level_number` tinyint(4) NOT NULL,
  `cf_level` enum('FPB','CFGM','CFGS') DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `course`
--

INSERT INTO `course` (`course_id`, `course_code`, `name`, `education_stage`, `level_number`, `cf_level`, `is_active`) VALUES
(1, 'ESO1', '1º ESO', 'ESO', 1, NULL, 1),
(2, 'ESO2', '2º ESO', 'ESO', 2, NULL, 1),
(3, 'ESO3', '3º ESO', 'ESO', 3, NULL, 1),
(4, 'ESO4', '4º ESO', 'ESO', 4, NULL, 1),
(5, 'BACH1', '1º Bachillerato', 'bachillerato', 1, NULL, 1),
(6, 'BACH2', '2º Bachillerato', 'bachillerato', 2, NULL, 1),
(7, 'CFGM-SMR-1', '1º Sistemas Microinformáticos y Redes', 'CF', 1, 'CFGM', 1),
(8, 'CFGM-SMR-2', '2º Sistemas Microinformáticos y Redes', 'CF', 2, 'CFGM', 1),
(9, 'CFGS-DAW-1', '1º Desarrollo de Aplicaciones Web', 'CF', 1, 'CFGS', 1),
(10, 'CFGS-DAW-2', '2º Desarrollo de Aplicaciones Web', 'CF', 2, 'CFGS', 1),
(11, 'CFGS-DAM-1', '1º Desarrollo de Aplicaciones Multiplataforma', 'CF', 1, 'CFGS', 1),
(12, 'CFGS-DAM-2', '2º Desarrollo de Aplicaciones Multiplataforma', 'CF', 2, 'CFGS', 1),
(13, 'CFGM-AC-1', '1º Actividades Comerciales', 'CF', 1, 'CFGM', 1),
(14, 'CFGM-AC-2', '2º Actividades Comerciales', 'CF', 2, 'CFGM', 1),
(15, 'CFGS-CI-1', '1º Comercio Internacional', 'CF', 1, 'CFGS', 1),
(16, 'CFGS-CI-2', '2º Comercio Internacional', 'CF', 2, 'CFGS', 1),
(17, 'CFGS-TL-1', '1º Transporte y Logística', 'CF', 1, 'CFGS', 1),
(18, 'CFGS-TL-2', '2º Transporte y Logística', 'CF', 2, 'CFGS', 1),
(19, 'FPB-SA-1', '1º Servicios Administrativos', 'CF', 1, 'FPB', 1),
(20, 'FPB-SA-2', '2º Servicios Administrativos', 'CF', 2, 'FPB', 1),
(21, 'CFGM-GA-1', '1º Gestión Administrativa', 'CF', 1, 'CFGM', 1),
(22, 'CFGM-GA-2', '2º Gestión Administrativa', 'CF', 2, 'CFGM', 1),
(23, 'CFGS-AF-1', '1º Administración y Finanzas', 'CF', 1, 'CFGS', 1),
(24, 'CFGS-AF-2', '2º Administración y Finanzas', 'CF', 2, 'CFGS', 1),
(26, 'CFGS-ASIR-1', '1º Administración de Sistemas Informáticos en Red', 'CF', 1, 'CFGS', 1),
(27, 'CFGS-ASIR-2', '2º Administración de Sistemas Informáticos en Red', 'CF', 2, 'CFGS', 1),
(28, 'cur-02', 'Curso 2', 'bachillerato', 2, NULL, 0),
(29, 'cur-01', 'Curso 1', 'bachillerato', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `course_subject`
--

CREATE TABLE `course_subject` (
  `course_id` int(11) NOT NULL,
  `subject_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `course_subject`
--

INSERT INTO `course_subject` (`course_id`, `subject_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(2, 29),
(3, 30),
(3, 31),
(3, 32),
(3, 33),
(3, 34),
(3, 35),
(3, 36),
(3, 37),
(3, 38),
(3, 39),
(3, 40),
(3, 41),
(3, 42),
(3, 43),
(3, 44),
(3, 45),
(4, 46),
(4, 47),
(4, 48),
(4, 49),
(4, 50),
(4, 51),
(4, 52),
(4, 53),
(4, 54),
(4, 55),
(4, 56),
(4, 57),
(4, 58),
(4, 59),
(4, 60),
(4, 61),
(4, 62),
(4, 63),
(5, 64),
(5, 65),
(5, 66),
(5, 67),
(5, 68),
(5, 69),
(5, 70),
(5, 71),
(5, 72),
(5, 73),
(5, 74),
(5, 75),
(5, 76),
(5, 77),
(5, 78),
(5, 79),
(5, 194),
(6, 80),
(6, 81),
(6, 82),
(6, 83),
(6, 84),
(6, 85),
(6, 86),
(6, 87),
(6, 88),
(6, 89),
(6, 90),
(6, 91),
(6, 92),
(6, 93),
(6, 94),
(6, 95),
(7, 96),
(7, 98),
(7, 99),
(7, 100),
(7, 101),
(8, 97),
(8, 102),
(8, 103),
(8, 104),
(8, 105),
(9, 96),
(9, 106),
(9, 107),
(9, 108),
(9, 109),
(9, 110),
(10, 97),
(10, 111),
(10, 112),
(10, 113),
(10, 114),
(10, 115),
(10, 116),
(11, 96),
(11, 106),
(11, 107),
(11, 108),
(11, 109),
(11, 110),
(12, 97),
(12, 117),
(12, 118),
(12, 119),
(12, 120),
(12, 121),
(12, 122),
(12, 123),
(13, 96),
(13, 124),
(13, 126),
(13, 127),
(13, 129),
(14, 97),
(14, 125),
(14, 128),
(14, 130),
(14, 131),
(15, 96),
(15, 132),
(15, 133),
(15, 134),
(15, 135),
(15, 136),
(16, 97),
(16, 137),
(16, 138),
(16, 139),
(16, 140),
(16, 141),
(16, 142),
(17, 96),
(17, 143),
(17, 144),
(17, 145),
(17, 146),
(17, 151),
(18, 97),
(18, 147),
(18, 148),
(18, 149),
(18, 150),
(18, 152),
(18, 153),
(19, 154),
(19, 155),
(19, 156),
(19, 157),
(19, 158),
(20, 159),
(20, 160),
(20, 161),
(21, 96),
(21, 162),
(21, 164),
(21, 165),
(21, 166),
(21, 167),
(22, 97),
(22, 163),
(22, 168),
(22, 169),
(22, 170),
(23, 96),
(23, 171),
(23, 172),
(23, 173),
(23, 174),
(23, 175),
(24, 97),
(24, 176),
(24, 177),
(24, 178),
(24, 179),
(24, 180),
(24, 181),
(26, 96),
(26, 109),
(26, 182),
(26, 183),
(26, 184),
(26, 185),
(27, 97),
(27, 186),
(27, 187),
(27, 188),
(27, 189),
(27, 190),
(27, 191),
(27, 192),
(27, 193);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `department`
--

CREATE TABLE `department` (
  `department_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `department`
--

INSERT INTO `department` (`department_id`, `name`, `is_active`) VALUES
(1, 'Artes plásticas', 1),
(2, 'Biología y Geología', 1),
(3, 'Economía', 1),
(4, 'Educación Física', 1),
(5, 'Administración', 1),
(6, 'Comercio', 1),
(7, 'Informática', 1),
(8, 'Filosofía', 1),
(9, 'Física y Química', 1),
(10, 'Fol', 1),
(11, 'Francés', 1),
(12, 'Geografía e Historia', 1),
(13, 'Inglés', 1),
(14, 'Latín', 1),
(15, 'Castellano', 1),
(16, 'Valenciano', 1),
(17, 'Matemáticas', 1),
(18, 'Música', 1),
(19, 'Orientación', 1),
(20, 'Religión', 1),
(21, 'Tecnología', 1),
(22, 'Nuevo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_schedule`
--

CREATE TABLE `event_schedule` (
  `schedule_id` int(11) NOT NULL,
  `type` enum('reservation','temp_pass') NOT NULL,
  `description` varchar(100) NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` enum('pending','approved','revoked','active','expired') NOT NULL DEFAULT 'pending',
  `reservation_status_reason` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_schedule`
--

INSERT INTO `event_schedule` (`schedule_id`, `type`, `description`, `start_at`, `end_at`, `status`, `reservation_status_reason`) VALUES
(87, 'temp_pass', 'Reserva de aula', '2025-11-12 10:00:00', '2025-11-12 11:00:00', 'approved', NULL),
(88, 'temp_pass', 'Reserva de aula', '2025-11-18 11:00:00', '2025-11-18 23:55:00', 'approved', NULL),
(90, 'reservation', 'Reserva de aula', '2025-11-24 10:00:00', '2025-11-24 11:00:00', 'approved', NULL),
(97, 'reservation', 'Reserva de aula', '2025-11-28 15:10:00', '2025-11-28 17:55:00', 'approved', NULL),
(115, 'reservation', 'Reserva de aula', '2025-11-25 17:00:00', '2025-11-25 20:05:00', 'approved', NULL),
(117, 'reservation', 'Reserva de aula', '2025-11-28 17:00:00', '2025-11-28 20:05:00', 'pending', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notification`
--

CREATE TABLE `notification` (
  `notification_id` bigint(20) NOT NULL,
  `type` enum('access','warning','alert') NOT NULL,
  `title` varchar(100) NOT NULL,
  `body` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notification_user`
--

CREATE TABLE `notification_user` (
  `user_id` char(36) NOT NULL,
  `notification_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_token`
--

CREATE TABLE `password_reset_token` (
  `token` varchar(6) NOT NULL,
  `user_id` char(36) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `is_used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permission`
--

CREATE TABLE `permission` (
  `user_id` char(36) NOT NULL,
  `room_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `permission`
--

INSERT INTO `permission` (`user_id`, `room_id`, `schedule_id`, `created_by`, `created_at`, `is_active`) VALUES
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 7, 87, '1a1fcf19-6cbc-4d30-be9f-59f337c633a5', '2025-11-12 09:50:33', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 8, 66, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 8, 67, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 9, 69, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 9, 70, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 31, 10, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 31, 11, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 32, 13, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 32, 14, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 33, 24, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 33, 25, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 35, 27, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 35, 28, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 36, 38, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 36, 39, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 37, 41, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 37, 42, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 38, 52, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 38, 53, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 41, 55, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 41, 56, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:24', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 8, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 9, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 67, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 68, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 1, 90, '6b86f7e7-bf19-4117-b262-a1221c4ced55', '2025-11-22 16:26:04', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 8, 11, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 8, 12, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 9, 97, '6b86f7e7-bf19-4117-b262-a1221c4ced55', '2025-11-22 19:11:06', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 23, 22, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 23, 23, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 24, 25, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 24, 26, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 24, 88, '1a1fcf19-6cbc-4d30-be9f-59f337c633a5', '2025-11-18 10:57:13', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 31, 36, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 31, 37, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 32, 40, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 32, 41, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 32, 117, '6b86f7e7-bf19-4117-b262-a1221c4ced55', '2025-11-27 15:28:09', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 36, 50, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 36, 51, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 36, 115, '6b86f7e7-bf19-4117-b262-a1221c4ced55', '2025-11-24 12:49:19', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 37, 53, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 37, 54, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 42, 64, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 42, 65, '2d9ce2e0-b172-4756-8c92-c647e3f0a649', '2025-11-23 21:33:11', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reader`
--

CREATE TABLE `reader` (
  `reader_id` int(11) NOT NULL,
  `reader_code` varchar(50) NOT NULL,
  `room_id` int(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reader`
--

INSERT INTO `reader` (`reader_id`, `reader_code`, `room_id`, `is_active`) VALUES
(1, 'READER-AULA-1', 1, 1),
(2, 'READER-TECNOLOGIA1', 2, 1),
(3, 'READER-ALMACEN-CENTRAL', 3, 1),
(4, 'READER-LIMPIEZA', 4, 1),
(5, 'READER-ARCHIVO', 5, 1),
(6, 'READER-VISITAS', 6, 1),
(7, 'READER-DIRECCION', 7, 1),
(8, 'READER-AULA-9', 8, 1),
(9, 'READER-AULA-10', 9, 1),
(10, 'READER-ALMACEN-SECRETARIA', 10, 1),
(11, 'READER-BIBLIOTECA', 11, 1),
(12, 'READER-TECNOLOGIA2', 12, 1),
(13, 'READER-ADMINISTRACION', 13, 1),
(14, 'READER-JEFES-ESTUDIOS', 14, 1),
(15, 'READER-FCT', 15, 1),
(16, 'READER-ALMACEN-18', 16, 1),
(17, 'READER-AULA-19', 17, 1),
(18, 'READER-GIMNASIO', 18, 1),
(19, 'READER-VESTUARIO2', 19, 1),
(20, 'READER-VESTUARIO1', 20, 1),
(21, 'READER-MATERIALES', 21, 1),
(22, 'READER-D1', 22, 1),
(23, 'READER-AULA-24', 23, 1),
(24, 'READER-AULA-25', 24, 1),
(25, 'READER-AULA-26', 25, 1),
(26, 'READER-DESDBL-OT', 26, 1),
(27, 'READER-CONSERJERIA', 27, 1),
(28, 'READER-AULA-31', 28, 1),
(29, 'READER-OTB', 29, 1),
(30, 'READER-OTA', 30, 1),
(31, 'READER-AULA-34', 31, 1),
(32, 'READER-AULA-35', 32, 1),
(33, 'READER-AULA-35A', 33, 1),
(34, 'READER-MUSICA1', 34, 1),
(35, 'READER-AULA-37', 35, 1),
(36, 'READER-AULA-38', 36, 1),
(37, 'READER-AULA-39', 37, 1),
(38, 'READER-AULA-40', 38, 1),
(39, 'READER-ALMACEN-44', 39, 1),
(40, 'READER-CAFETERIA', 40, 1),
(41, 'READER-AULA-46', 41, 1),
(42, 'READER-AULA-47', 42, 1),
(43, 'READER-MUSICA2-LM', 43, 1),
(44, 'READER-MUSICA-D2-PIANO', 44, 1),
(45, 'READER-MUSICA-D3', 45, 1),
(46, 'READER-MUSICA-D4', 46, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `name` enum('admin','teacher','janitor','support_staff') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`role_id`, `name`) VALUES
(1, 'admin'),
(2, 'teacher'),
(3, 'janitor'),
(4, 'support_staff');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_user`
--

CREATE TABLE `role_user` (
  `user_id` char(36) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `role_user`
--

INSERT INTO `role_user` (`user_id`, `role_id`) VALUES
('2371db6b-d998-4be1-955a-20a47b0b8cf7', 1),
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 1),
('2371db6b-d998-4be1-955a-20a47b0b8cf7', 2),
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 2),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 2),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 2),
('cb31d2bf-f1e2-4fd1-a674-5203370d8475', 2),
('ee79b47a-5afe-4009-b3ed-f23bbf737ba7', 2),
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 3),
('5c254cec-9b74-4fce-a280-069a20399901', 3),
('c3496420-0e39-4af4-951e-5b11f54e5022', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `room`
--

CREATE TABLE `room` (
  `room_id` int(11) NOT NULL,
  `room_code` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `capacity` smallint(6) NOT NULL,
  `building` smallint(6) NOT NULL,
  `floor` smallint(6) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `room`
--

INSERT INTO `room` (`room_id`, `room_code`, `name`, `course_id`, `capacity`, `building`, `floor`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '1', 'Aula', NULL, 20, 1, 1, 1, '2025-11-24 11:43:30.960195', '2025-11-24 11:43:30.960195'),
(2, '2', 'Tecnología 1 - Aula', NULL, 25, 1, 1, 1, '2025-11-24 11:43:30.962543', '2025-11-24 11:43:30.962543'),
(3, '4', 'Almacén central', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.964847', '2025-11-24 11:43:30.964847'),
(4, '5', 'Limpieza', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.966731', '2025-11-24 11:43:30.966731'),
(5, '6', 'Archivo', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.968945', '2025-11-24 11:43:30.968945'),
(6, '7', 'Visitas', NULL, 8, 1, 1, 1, '2025-11-24 11:43:30.970941', '2025-11-24 11:43:30.970941'),
(7, '8', 'Dirección', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.973084', '2025-11-24 11:43:30.973084'),
(8, '9', 'Aula', NULL, 20, 1, 1, 1, '2025-11-24 11:43:30.975100', '2025-11-24 11:43:30.975100'),
(9, '10', 'Aula', NULL, 20, 1, 1, 1, '2025-11-24 11:43:30.976790', '2025-11-24 11:43:30.976790'),
(10, '11', 'Almacén secretaría', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.978511', '2025-11-24 11:43:30.978511'),
(11, '12', 'Biblioteca', NULL, 15, 1, 1, 1, '2025-11-24 11:43:30.980481', '2025-11-24 11:43:30.980481'),
(12, '13', 'Tecnología 2 - Aula', NULL, 20, 1, 1, 1, '2025-11-24 11:43:30.982308', '2025-11-24 11:43:30.982308'),
(13, '15', 'Administración', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.984289', '2025-11-24 11:43:30.984289'),
(14, '16', 'Jefes de Estudios', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.986328', '2025-11-24 11:43:30.986328'),
(15, '17', 'FCT', NULL, 7, 1, 1, 1, '2025-11-24 11:43:30.988834', '2025-11-24 11:43:30.988834'),
(16, '18', 'Almacén', NULL, 0, 1, 1, 1, '2025-11-24 11:43:30.991087', '2025-11-24 11:43:30.991087'),
(17, '19', 'Aula', NULL, 20, 1, 1, 1, '2025-11-24 11:43:30.993103', '2025-11-24 11:43:30.993103'),
(18, '20', 'Gimnasio', NULL, 50, 1, 1, 1, '2025-11-24 11:43:30.995103', '2025-11-24 11:43:30.995103'),
(19, '20A', 'Vestuario2', NULL, 15, 2, 1, 1, '2025-11-24 11:43:30.997026', '2025-11-24 11:43:30.997026'),
(20, '21', 'Vestuario1', NULL, 15, 2, 1, 1, '2025-11-24 11:43:30.998863', '2025-11-24 11:43:30.998863'),
(21, '22', 'Materiales', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.000608', '2025-11-24 11:43:31.000608'),
(22, '23', 'D1', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.002624', '2025-11-24 11:43:31.002624'),
(23, '24', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.004502', '2025-11-24 11:43:31.004502'),
(24, '25', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.006927', '2025-11-24 11:43:31.006927'),
(25, '26', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.008967', '2025-11-24 11:43:31.008967'),
(26, '27', 'DESDBL - OT', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.010877', '2025-11-24 11:43:31.010877'),
(27, '30', 'Conserjería', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.012547', '2025-11-24 11:43:31.012547'),
(28, '31', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.014239', '2025-11-24 11:43:31.014239'),
(29, '32', 'OT.B', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.016165', '2025-11-24 11:43:31.016165'),
(30, '33', 'OT.A', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.018275', '2025-11-24 11:43:31.018275'),
(31, '34', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.024562', '2025-11-24 11:43:31.024562'),
(32, '35', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.026443', '2025-11-24 11:43:31.026443'),
(33, '35A', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.028258', '2025-11-24 11:43:31.028258'),
(34, '36', 'Música 1 - Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.030180', '2025-11-24 11:43:31.030180'),
(35, '37', 'Aula', NULL, 15, 2, 1, 1, '2025-11-24 11:43:31.032185', '2025-11-24 11:43:31.032185'),
(36, '38', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.033858', '2025-11-24 11:43:31.033858'),
(37, '39', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.035678', '2025-11-24 11:43:31.035678'),
(38, '40', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.037474', '2025-11-24 11:43:31.037474'),
(39, '44', 'Almacén', NULL, 0, 2, 1, 1, '2025-11-24 11:43:31.039537', '2025-11-24 11:43:31.039537'),
(40, '45', 'Cafetería', NULL, 50, 2, 1, 1, '2025-11-24 11:43:31.041286', '2025-11-24 11:43:31.041286'),
(41, '46', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.043094', '2025-11-24 11:43:31.043094'),
(42, '47', 'Aula', NULL, 20, 2, 1, 1, '2025-11-24 11:43:31.044949', '2025-11-24 11:43:31.044949'),
(43, '48', 'Música 2 - Lenguaje Musical - Aula', NULL, 15, 2, 1, 1, '2025-11-24 11:43:31.046692', '2025-11-24 11:43:31.046692'),
(44, '49', 'Música - D2 Piano - Aula', NULL, 7, 2, 1, 1, '2025-11-24 11:43:31.048471', '2025-11-24 11:43:31.048471'),
(45, '50', 'Música - D3 - Aula', NULL, 7, 2, 1, 1, '2025-11-24 11:43:31.050209', '2025-11-24 11:43:31.050209'),
(46, '51', 'Música - D4 - Aula', NULL, 7, 2, 1, 1, '2025-11-24 11:43:31.052017', '2025-11-24 11:43:31.052017');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `schedule`
--

CREATE TABLE `schedule` (
  `schedule_id` int(11) NOT NULL,
  `type` enum('weekly','event') NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `schedule`
--

INSERT INTO `schedule` (`schedule_id`, `type`, `academic_year_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(2, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(3, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(4, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(5, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(6, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(7, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(8, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(9, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(10, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(11, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(12, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(13, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(14, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(15, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(16, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(17, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(18, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(19, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(20, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(21, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(22, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(23, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(24, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(25, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(26, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(27, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(28, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(29, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(30, 'weekly', 3, 1, '2025-09-01 08:00:00', '2025-11-10 17:47:51.417687'),
(31, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(32, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(33, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(34, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(35, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(36, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(37, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(38, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(39, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(40, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(41, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(42, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(43, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(44, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(45, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(46, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(47, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(48, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(49, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(50, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(51, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(52, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(53, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(54, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(55, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(56, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(57, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(58, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(59, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(60, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(61, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(62, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(63, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(64, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(65, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(66, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(67, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(68, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(69, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(70, 'weekly', 3, 1, '2025-11-23 20:24:31', '2025-11-23 20:24:31.586928'),
(87, 'event', 3, 1, '2025-11-12 09:50:33', '2025-11-12 09:50:33.874370'),
(88, 'event', 3, 1, '2025-11-18 10:57:13', '2025-11-18 10:57:13.892615'),
(90, 'event', 3, 1, '2025-11-22 16:26:04', '2025-11-22 16:26:04.948060'),
(97, 'event', 3, 1, '2025-11-22 19:11:06', '2025-11-22 19:11:06.354015'),
(115, 'event', 3, 1, '2025-11-24 12:49:19', '2025-11-24 12:49:19.365633'),
(117, 'event', 3, 1, '2025-11-27 15:28:09', '2025-11-27 15:28:09.332112');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subject`
--

CREATE TABLE `subject` (
  `subject_id` bigint(20) NOT NULL,
  `subject_code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department_id` int(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `subject`
--

INSERT INTO `subject` (`subject_id`, `subject_code`, `name`, `department_id`, `is_active`) VALUES
(1, 'MAT-ESO-1', 'Matemáticas 1', 17, 1),
(2, 'LEN-ESO-1', 'Lengua Castellana 1', 15, 1),
(3, 'VAL-ESO-1', 'Valenciano 1', 16, 1),
(4, 'ENG-ESO-1', 'Inglés 1', 13, 1),
(5, 'GH-ESO-1', 'Geografía e Historia 1', 12, 1),
(6, 'BIO-ESO-1', 'Biología 1', 2, 1),
(7, 'VALE-ESO-1', 'Valores Éticos 1', 8, 1),
(8, 'TEC-ESO-1', 'Tecnología 1', 21, 1),
(9, 'EF-ESO-1', 'Educación Física 1', 4, 1),
(10, 'MUS-ESO-1', 'Música 1', 18, 1),
(11, 'DIG-ESO-1', 'Digitalización 1', 7, 1),
(12, 'FRA-ESO-1', 'Francés 1', 11, 1),
(13, 'ART-ESO-1', 'Plástica 1', 1, 1),
(14, 'REL-ESO-1', 'Religión 1', 20, 1),
(15, 'LEN-ESO-2', 'Lengua Castellana 2', 15, 1),
(16, 'VAL-ESO-2', 'Valenciano 2', 16, 1),
(17, 'ENG-ESO-2', 'Inglés 2', 13, 1),
(18, 'MAT-ESO-2', 'Matemáticas 2', 17, 1),
(19, 'GH-ESO-2', 'Geografía e Historia 2', 12, 1),
(20, 'FYQ-ESO-2', 'Física y Química 2', 9, 1),
(21, 'TEC-ESO-2', 'Tecnología 2', 21, 1),
(22, 'EF-ESO-2', 'Educación Física 2', 4, 1),
(23, 'MUS-ESO-2', 'Música 2', 18, 1),
(24, 'ART-ESO-2', 'Plástica 2', 1, 1),
(25, 'DIG-ESO-2', 'Digitalización 2', 7, 1),
(26, 'FRA-ESO-2', 'Francés 2', 11, 1),
(27, 'REL-ESO-2', 'Religión 2', 20, 1),
(28, 'VALE-ESO-2', 'Valores Éticos 2', 8, 1),
(29, 'TUT-ESO-2', 'Tutoría 2º ESO', 19, 1),
(30, 'LEN-ESO-3', 'Lengua Castellana 3', 15, 1),
(31, 'VAL-ESO-3', 'Valenciano 3', 16, 1),
(32, 'ENG-ESO-3', 'Inglés 3', 13, 1),
(33, 'MAT-ESO-3', 'Matemáticas 3', 17, 1),
(34, 'GH-ESO-3', 'Geografía e Historia 3', 12, 1),
(35, 'BIO-ESO-3', 'Biología 3', 2, 1),
(36, 'FYQ-ESO-3', 'Física y Química 3', 9, 1),
(37, 'TEC-ESO-3', 'Tecnología 3', 21, 1),
(38, 'EF-ESO-3', 'Educación Física 3', 4, 1),
(39, 'MUS-ESO-3', 'Música 3', 18, 1),
(40, 'ART-ESO-3', 'Plástica 3', 1, 1),
(41, 'DIG-ESO-3', 'Digitalización 3', 7, 1),
(42, 'FRA-ESO-3', 'Francés 3', 11, 1),
(43, 'REL-ESO-3', 'Religión 3', 20, 1),
(44, 'VALE-ESO-3', 'Valores Éticos 3', 8, 1),
(45, 'TUT-ESO-3', 'Tutoría 3º ESO', 19, 1),
(46, 'LEN-ESO-4', 'Lengua Castellana 4', 15, 1),
(47, 'VAL-ESO-4', 'Valenciano 4', 16, 1),
(48, 'ENG-ESO-4', 'Inglés 4', 13, 1),
(49, 'MAT-ESO-4', 'Matemáticas 4', 17, 1),
(50, 'GH-ESO-4', 'Geografía e Historia 4', 12, 1),
(51, 'BIO-ESO-4', 'Biología 4', 2, 1),
(52, 'FYQ-ESO-4', 'Física y Química 4', 9, 1),
(53, 'TEC-ESO-4', 'Tecnología 4', 21, 1),
(54, 'DIG-ESO-4', 'Digitalización 4', 7, 1),
(55, 'EF-ESO-4', 'Educación Física 4', 4, 1),
(56, 'MUS-ESO-4', 'Música 4', 18, 1),
(57, 'ART-ESO-4', 'Plástica 4', 1, 1),
(58, 'FRA-ESO-4', 'Francés 4', 11, 1),
(59, 'REL-ESO-4', 'Religión 4', 20, 1),
(60, 'VALE-ESO-4', 'Valores Éticos 4', 8, 1),
(61, 'FIL-ESO-4', 'Filosofía 4', 8, 1),
(62, 'ECO-ESO-4', 'Economía 4', 3, 1),
(63, 'TUT-ESO-4', 'Tutoría 4º ESO', 19, 1),
(64, 'LEN-BACH-1', 'Lengua Castellana y Literatura I', 15, 1),
(65, 'VAL-BACH-1', 'Valenciano I', 16, 1),
(66, 'ENG-BACH-1', 'Inglés I', 13, 1),
(67, 'FIL-BACH-1', 'Filosofía 1', 8, 1),
(68, 'MAT-BACH-1', 'Matemáticas I', 17, 1),
(69, 'HMC-BACH-1', 'Historia del Mundo Contemporáneo', 12, 1),
(70, 'BIO-BACH-1', 'Biología I', 2, 1),
(71, 'FIS-BACH-1', 'Física I', 9, 1),
(72, 'QUI-BACH-1', 'Química I', 9, 1),
(73, 'ECO-BACH-1', 'Economía 1', 3, 1),
(74, 'LAT-BACH-1', 'Latín I', 14, 1),
(75, 'TIC-BACH-1', 'TIC I', 7, 1),
(76, 'EF-BACH-1', 'Educación Física Bach 1', 4, 1),
(77, 'REL-BACH-1', 'Religión Bach 1', 20, 1),
(78, 'VALE-BACH-1', 'Valores Éticos Bach 1', 8, 1),
(79, 'TUT-BACH-1', 'Tutoría 1º Bachillerato', 19, 1),
(80, 'LEN-BACH-2', 'Lengua Castellana y Literatura II', 15, 1),
(81, 'VAL-BACH-2', 'Valenciano II', 16, 1),
(82, 'ENG-BACH-2', 'Inglés II', 13, 1),
(83, 'FIL-BACH-2', 'Historia de la Filosofía', 8, 1),
(84, 'MAT-BACH-2', 'Matemáticas II', 17, 1),
(85, 'HESP-BACH-2', 'Historia de España 2', 12, 1),
(86, 'BIO-BACH-2', 'Biología II', 2, 1),
(87, 'FIS-BACH-2', 'Física II', 9, 1),
(88, 'QUI-BACH-2', 'Química II', 9, 1),
(89, 'ECO-BACH-2', 'Economía de la Empresa', 3, 1),
(90, 'LAT-BACH-2', 'Latín II', 14, 1),
(91, 'TIC-BACH-2', 'TIC II', 7, 1),
(92, 'CTM-BACH-2', 'Ciencias de la Tierra y Medioambientales', 2, 1),
(93, 'REL-BACH-2', 'Religión Bach 2', 20, 1),
(94, 'VALE-BACH-2', 'Valores Éticos Bach 2', 8, 1),
(95, 'TUT-BACH-2', 'Tutoría 2º Bachillerato', 19, 1),
(96, 'FOL-CF', 'Formación y Orientación Laboral', 10, 1),
(97, 'EIE-CF', 'Empresa e Iniciativa Emprendedora', 10, 1),
(98, 'MME-SMR', 'Montaje y mantenimiento de equipos', 7, 1),
(99, 'SOM-SMR', 'Sistemas operativos monopuesto', 7, 1),
(100, 'AO-SMR', 'Aplicaciones ofimáticas', 7, 1),
(101, 'RL-SMR', 'Redes locales', 7, 1),
(102, 'SOR-SMR', 'Sistemas operativos en red', 7, 1),
(103, 'SR-SMR', 'Servicios en red', 7, 1),
(104, 'SEG-SMR', 'Seguridad informática', 7, 1),
(105, 'AW-SMR', 'Aplicaciones web', 7, 1),
(106, 'PROG-CF', 'Programación', 7, 1),
(107, 'BD-CF', 'Bases de Datos', 7, 1),
(108, 'SI-CF', 'Sistemas Informáticos', 7, 1),
(109, 'LM-CF', 'Lenguajes de Marcas y Sistemas de Gestión de Información', 7, 1),
(110, 'ED-CF', 'Entornos de Desarrollo', 7, 1),
(111, 'PROY-DAW', 'Proyecto de Desarrollo de Aplicaciones Web', 7, 1),
(112, 'DWEC-DAW', 'Desarrollo Web en Entorno Cliente', 7, 1),
(113, 'DWES-DAW', 'Desarrollo Web en Entorno Servidor', 7, 1),
(114, 'DIW-DAW', 'Diseño de Interfaces Web', 7, 1),
(115, 'DEP-DAW', 'Despliegue de Aplicaciones Web', 7, 1),
(116, 'FCT-DAW', 'Formación en Centros de Trabajo (DAW)', 7, 1),
(117, 'AD-DAM', 'Acceso a Datos (DAM)', 7, 1),
(118, 'DI-DAM', 'Desarrollo de Interfaces (DAM)', 7, 1),
(119, 'PMDM-DAM', 'Programación multimedia y de dispositivos móviles (DAM)', 7, 1),
(120, 'PSP-DAM', 'Programación de servicios y procesos (DAM)', 7, 1),
(121, 'SGE-DAM', 'Sistemas de gestión empresarial (DAM)', 7, 1),
(122, 'PROY-DAM', 'Proyecto de Desarrollo de Aplicaciones Multiplataforma', 7, 1),
(123, 'FCT-DAM', 'Formación en Centros de Trabajo (DAM)', 7, 1),
(124, 'MK-AC', 'Marketing en la actividad comercial', 6, 1),
(125, 'GCOM-AC', 'Gestión de compras', 6, 1),
(126, 'TALM-AC', 'Técnicas de almacén', 6, 1),
(127, 'PV-AC', 'Procesos de venta', 6, 1),
(128, 'SAC-AC', 'Servicios de atención al cliente', 6, 1),
(129, 'AIC-AC', 'Aplicaciones informáticas para el comercio', 6, 1),
(130, 'PROY-AC', 'Proyecto de Actividades Comerciales', 6, 1),
(131, 'FCT-AC', 'Formación en Centros de Trabajo (Actividades Comerciales)', 6, 1),
(132, 'GACI-CI', 'Gestión administrativa del comercio internacional', 6, 1),
(133, 'TIM-CI', 'Transporte internacional de mercancías', 6, 1),
(134, 'LOGA-CI', 'Logística de almacenamiento', 6, 1),
(135, 'SIM-CI', 'Sistema de información de mercados', 6, 1),
(136, 'MKI-CI', 'Marketing internacional', 6, 1),
(137, 'NEG-CI', 'Negociación internacional', 6, 1),
(138, 'FINT-CI', 'Financiación internacional', 6, 1),
(139, 'MPINT-CI', 'Medios de pago internacionales', 6, 1),
(140, 'ECOD-CI', 'Comercio digital internacional', 6, 1),
(141, 'PROY-CI', 'Proyecto de Comercio Internacional', 6, 1),
(142, 'FCT-CI', 'Formación en Centros de Trabajo (Comercio Internacional)', 6, 1),
(143, 'GATL-TL', 'Gestión administrativa del transporte y la logística', 6, 1),
(144, 'TIM-TL', 'Transporte internacional de mercancías (TL)', 6, 1),
(145, 'LOGA-TL', 'Logística de almacenamiento (TL)', 6, 1),
(146, 'LOGAP-TL', 'Logística de aprovisionamiento', 6, 1),
(147, 'OTV-TL', 'Organización del transporte de viajeros', 6, 1),
(148, 'OTM-TL', 'Organización del transporte de mercancías', 6, 1),
(149, 'COM-TL', 'Comercialización del transporte y la logística', 6, 1),
(150, 'GEF-TL', 'Gestión económica y financiera del transporte', 6, 1),
(151, 'ENG-TL', 'Inglés aplicado a transporte y logística', 13, 1),
(152, 'PROY-TL', 'Proyecto de Transporte y Logística', 6, 1),
(153, 'FCT-TL', 'Formación en Centros de Trabajo (Transporte y Logística)', 6, 1),
(154, 'TAD-FPB', 'Tratamiento informático de datos', 5, 1),
(155, 'TAB-FPB', 'Técnicas administrativas básicas', 5, 1),
(156, 'ACO-FPB', 'Archivo y comunicación', 5, 1),
(157, 'ATC-FPB', 'Atención al cliente (FPB)', 5, 1),
(158, 'OFI-FPB', 'Aplicaciones básicas de ofimática', 5, 1),
(159, 'VTA-FPB', 'Venta y servicio al cliente', 5, 1),
(160, 'PROY-FPB', 'Proyecto de Servicios Administrativos', 5, 1),
(161, 'FCT-FPB', 'Formación en Centros de Trabajo (Servicios Administrativos)', 5, 1),
(162, 'OCOM-GA', 'Operaciones administrativas de compraventa', 5, 1),
(163, 'ORRHH-GA', 'Operaciones administrativas de recursos humanos', 5, 1),
(164, 'TDC-GA', 'Tratamiento de la documentación contable', 5, 1),
(165, 'TECC-GA', 'Técnica contable', 5, 1),
(166, 'EA-GA', 'Empresa y administración', 5, 1),
(167, 'CEAC-GA', 'Comunicación empresarial y atención al cliente', 5, 1),
(168, 'AIG-GA', 'Aplicaciones informáticas de gestión', 5, 1),
(169, 'PROY-GA', 'Proyecto de Gestión Administrativa', 5, 1),
(170, 'FCT-GA', 'Formación en Centros de Trabajo (Gestión Administrativa)', 5, 1),
(171, 'CA-AF', 'Comunicación y atención al cliente', 5, 1),
(172, 'GDJE-AF', 'Gestión de la documentación jurídica y empresarial', 5, 1),
(173, 'PIA-AF', 'Proceso integral de la actividad comercial', 5, 1),
(174, 'OFI-AF', 'Ofimática y proceso de la información', 5, 1),
(175, 'RRHH-AF', 'Recursos humanos y responsabilidad social corporativa', 5, 1),
(176, 'GFI-AF', 'Gestión financiera', 5, 1),
(177, 'CONTFIS-AF', 'Contabilidad y fiscalidad', 5, 1),
(178, 'GLC-AF', 'Gestión logística y comercial', 5, 1),
(179, 'SIM-AF', 'Simulación empresarial', 5, 1),
(180, 'PROY-AF', 'Proyecto de Administración y Finanzas', 5, 1),
(181, 'FCT-AF', 'Formación en Centros de Trabajo (Administración y Finanzas)', 5, 1),
(182, 'SO-ASIR', 'Implantación de sistemas operativos', 7, 1),
(183, 'RED-ASIR', 'Planificación y administración de redes', 7, 1),
(184, 'HW-ASIR', 'Fundamentos de hardware', 7, 1),
(185, 'GBD-ASIR', 'Gestión de bases de datos (ASIR)', 7, 1),
(186, 'ASO-ASIR', 'Administración de sistemas operativos', 7, 1),
(187, 'SRED-ASIR', 'Servicios de red', 7, 1),
(188, 'SEG-ASIR', 'Seguridad y alta disponibilidad', 7, 1),
(189, 'IAW-ASIR', 'Implantación de aplicaciones web', 7, 1),
(190, 'SGBD-ASIR', 'Administración de sistemas gestores de bases de datos', 7, 1),
(191, 'ENG-ASIR', 'Inglés técnico para informática', 13, 1),
(192, 'PROY-ASIR', 'Proyecto de Administración de Sistemas Informáticos en Red', 7, 1),
(193, 'FCT-ASIR', 'Formación en Centros de Trabajo (ASIR)', 7, 1),
(194, 'NUEVA', 'nueva', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE `tag` (
  `tag_id` int(11) NOT NULL,
  `tag_code` varchar(64) NOT NULL,
  `user_id` char(36) NOT NULL,
  `type` enum('rfid','nfc_mobile') NOT NULL DEFAULT 'rfid',
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tag`
--

INSERT INTO `tag` (`tag_id`, `tag_code`, `user_id`, `type`, `issued_at`, `is_active`) VALUES
(1, 'eg6QmXdw64GyALEOvDlTjg', '1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'nfc_mobile', '2025-11-08 16:43:56', 1),
(2, 'M9MS_v0GcE7GzreKZdaaAA', '2d9ce2e0-b172-4756-8c92-c647e3f0a649', 'nfc_mobile', '2025-11-08 16:43:56', 1),
(3, 'ZOD08vIoypmyRKjfIPy_Fg', '2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 'nfc_mobile', '2025-11-08 16:43:56', 1),
(4, 'zhO5seOQje-KXK6Kag5OUQ', '6b86f7e7-bf19-4117-b262-a1221c4ced55', 'nfc_mobile', '2025-11-08 16:43:56', 1),
(5, 'x4m7QsJ12Le8p2WbXjvn1w', 'c3496420-0e39-4af4-951e-5b11f54e5022', 'nfc_mobile', '2025-11-08 16:43:56', 1),
(6, 'OBxCH99hvOFndRkmVOPrJw', '1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'rfid', '2025-11-08 16:43:56', 1),
(7, 'm4mckw7MpJgmFMeq1GNr2g', '2d9ce2e0-b172-4756-8c92-c647e3f0a649', 'rfid', '2025-11-08 16:43:56', 1),
(8, '06yZo5FVGxLSYUvZfqmfSQ', '2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 'rfid', '2025-11-08 16:43:56', 1),
(9, 'sYp2HKAJMB4Q-ZmFygKjeA', '6b86f7e7-bf19-4117-b262-a1221c4ced55', 'rfid', '2025-11-08 16:43:56', 1),
(10, '4YGxKkADpDp-cSBVikZvWw', 'c3496420-0e39-4af4-951e-5b11f54e5022', 'rfid', '2025-11-08 16:43:56', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teacher`
--

CREATE TABLE `teacher` (
  `user_id` char(36) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `teacher`
--

INSERT INTO `teacher` (`user_id`, `department_id`) VALUES
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 2),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 6),
('2371db6b-d998-4be1-955a-20a47b0b8cf7', 7),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 7),
('cb31d2bf-f1e2-4fd1-a674-5203370d8475', 7),
('ee79b47a-5afe-4009-b3ed-f23bbf737ba7', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teacher_subject`
--

CREATE TABLE `teacher_subject` (
  `user_id` char(36) NOT NULL,
  `subject_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `teacher_subject`
--

INSERT INTO `teacher_subject` (`user_id`, `subject_id`) VALUES
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 99),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 101),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 102),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 104),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 108),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 124),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 127),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 132),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 136),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 143);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `user_id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(60) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `valid_from` datetime NOT NULL DEFAULT current_timestamp(),
  `valid_to` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token_version` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`user_id`, `name`, `lastname`, `email`, `password_hash`, `avatar`, `valid_from`, `valid_to`, `created_at`, `token_version`) VALUES
('1a1fcf19-6cbc-4d30-be9f-59f337c633a5', 'Marta', 'Fernández Ruiz', 'janitor@gva.es', '$2y$12$eONPHWFysmGZtD3gcsrXMOPy.2LdKWkGrZ7DjKhB99PPc72tPVQbG', 'avatar_1a1fcf19-6cbc-4d30-be9f-59f337c633a5.webp', '2025-10-05 05:33:04', NULL, '2025-11-24 11:53:55', 3),
('2371db6b-d998-4be1-955a-20a47b0b8cf7', 'Sergio', 'Pérez Rubalcaba', 'sergio@email.com', '$2y$12$5aa0YGOwza3pWXY9PmGaluNE5Yt7rFXat1sm/kGUPEpaNFN4Seami', 'avatar_default_m4.png', '2026-02-02 07:19:39', NULL, '2026-02-02 07:19:39', 1),
('2d9ce2e0-b172-4756-8c92-c647e3f0a649', 'Ana', 'Morales Martínez', 'admin@gva.es', '$2y$12$eONPHWFysmGZtD3gcsrXMOPy.2LdKWkGrZ7DjKhB99PPc72tPVQbG', 'avatar_2d9ce2e0-b172-4756-8c92-c647e3f0a649_1770112251054.webp', '2025-10-05 05:33:04', NULL, '2025-11-24 11:53:55', 3),
('2f09b2f8-3e2a-4cb6-b907-e98db842b4ee', 'Luis', 'Torregrosa Pérez', 'teacher@gva.es', '$2y$12$eONPHWFysmGZtD3gcsrXMOPy.2LdKWkGrZ7DjKhB99PPc72tPVQbG', 'avatar_2f09b2f8-3e2a-4cb6-b907-e98db842b4ee.webp', '2025-10-05 05:33:04', NULL, '2025-11-24 11:53:55', 2),
('5c254cec-9b74-4fce-a280-069a20399901', 'Nombre', 'Apellidos', 'nuevo@email.com', '$2y$12$iTJ3Cz0If3o243xZj1hK8esK7MKbAeRsJCxdJD8qDHBDd626r9eTy', 'avatar_default_f6.png', '2026-02-02 04:28:16', NULL, '2026-02-02 04:28:16', 1),
('6b86f7e7-bf19-4117-b262-a1221c4ced55', 'Paco', 'García Donat', 'pagado@gva.es', '$2y$12$RQOK4Tjzg9QyH8ModkLx3eZnRmGuwQmJU6zr3SzyCU3k8FEhMteH6', 'avatar_6b86f7e7-bf19-4117-b262-a1221c4ced55_1765538616462.webp', '2025-11-04 09:15:32', NULL, '2025-11-24 11:53:55', 17),
('c3496420-0e39-4af4-951e-5b11f54e5022', 'Eva', 'Mendes López', 'staff@gva.es', '$2y$12$eONPHWFysmGZtD3gcsrXMOPy.2LdKWkGrZ7DjKhB99PPc72tPVQbG', 'avatar_c3496420-0e39-4af4-951e-5b11f54e5022.webp', '2025-10-05 05:33:04', NULL, '2025-11-24 11:53:55', 2),
('cb31d2bf-f1e2-4fd1-a674-5203370d8475', 'Francisco', 'Montés Doria', 'framondo@gmail.com', '$2y$12$fjmrIrpe5HZppGoJvYSqt.SMV3rdIeUzK/cD.t7nw92.lIs4HISnu', 'avatar_cb31d2bf-f1e2-4fd1-a674-5203370d8475_1771777098015.jpg', '2026-02-01 16:21:46', NULL, '2026-02-01 16:21:46', 1),
('ee79b47a-5afe-4009-b3ed-f23bbf737ba7', 'Pepe', 'Tenaz Pérez', 'pepe@email.com', '$2y$12$7fQ.L7iW5EF5d6M3REU0ge7v.DTie7K4u5o6XuCSF/a7a6vNohuIa', 'avatar_default_m3.png', '2026-02-02 07:55:50', NULL, '2026-02-02 07:55:50', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `weekly_schedule`
--

CREATE TABLE `weekly_schedule` (
  `schedule_id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `weekly_schedule`
--

INSERT INTO `weekly_schedule` (`schedule_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 1, '08:00:00', '08:55:00'),
(2, 1, '08:55:00', '09:50:00'),
(3, 1, '10:15:00', '11:10:00'),
(4, 1, '11:10:00', '12:05:00'),
(5, 1, '12:05:00', '13:00:00'),
(6, 1, '13:10:00', '14:05:00'),
(7, 1, '14:05:00', '15:00:00'),
(8, 1, '15:10:00', '16:05:00'),
(9, 1, '16:05:00', '17:00:00'),
(10, 1, '17:00:00', '17:55:00'),
(11, 1, '18:15:00', '19:10:00'),
(12, 1, '19:10:00', '20:05:00'),
(13, 1, '20:05:00', '21:00:00'),
(14, 1, '21:10:00', '22:00:00'),
(15, 2, '08:00:00', '08:55:00'),
(16, 2, '08:55:00', '09:50:00'),
(17, 2, '10:15:00', '11:10:00'),
(18, 2, '11:10:00', '12:05:00'),
(19, 2, '12:05:00', '13:00:00'),
(20, 2, '13:10:00', '14:05:00'),
(21, 2, '14:05:00', '15:00:00'),
(22, 2, '15:10:00', '16:05:00'),
(23, 2, '16:05:00', '17:00:00'),
(24, 2, '17:00:00', '17:55:00'),
(25, 2, '18:15:00', '19:10:00'),
(26, 2, '19:10:00', '20:05:00'),
(27, 2, '20:05:00', '21:00:00'),
(28, 2, '21:10:00', '22:00:00'),
(29, 3, '08:00:00', '08:55:00'),
(30, 3, '08:55:00', '09:50:00'),
(31, 3, '10:15:00', '11:10:00'),
(32, 3, '11:10:00', '12:05:00'),
(33, 3, '12:05:00', '13:00:00'),
(34, 3, '13:10:00', '14:05:00'),
(35, 3, '14:05:00', '15:00:00'),
(36, 3, '15:10:00', '16:05:00'),
(37, 3, '16:05:00', '17:00:00'),
(38, 3, '17:00:00', '17:55:00'),
(39, 3, '18:15:00', '19:10:00'),
(40, 3, '19:10:00', '20:05:00'),
(41, 3, '20:05:00', '21:00:00'),
(42, 3, '21:10:00', '22:00:00'),
(43, 4, '08:00:00', '08:55:00'),
(44, 4, '08:55:00', '09:50:00'),
(45, 4, '10:15:00', '11:10:00'),
(46, 4, '11:10:00', '12:05:00'),
(47, 4, '12:05:00', '13:00:00'),
(48, 4, '13:10:00', '14:05:00'),
(49, 4, '14:05:00', '15:00:00'),
(50, 4, '15:10:00', '16:05:00'),
(51, 4, '16:05:00', '17:00:00'),
(52, 4, '17:00:00', '17:55:00'),
(53, 4, '18:15:00', '19:10:00'),
(54, 4, '19:10:00', '20:05:00'),
(55, 4, '20:05:00', '21:00:00'),
(56, 4, '21:10:00', '22:00:00'),
(57, 5, '08:00:00', '08:55:00'),
(58, 5, '08:55:00', '09:50:00'),
(59, 5, '10:15:00', '11:10:00'),
(60, 5, '11:10:00', '12:05:00'),
(61, 5, '12:05:00', '13:00:00'),
(62, 5, '13:10:00', '14:05:00'),
(63, 5, '14:05:00', '15:00:00'),
(64, 5, '15:10:00', '16:05:00'),
(65, 5, '16:05:00', '17:00:00'),
(66, 5, '17:00:00', '17:55:00'),
(67, 5, '18:15:00', '19:10:00'),
(68, 5, '19:10:00', '20:05:00'),
(69, 5, '20:05:00', '21:00:00'),
(70, 5, '21:10:00', '22:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `academic_year`
--
ALTER TABLE `academic_year`
  ADD PRIMARY KEY (`academic_year_id`),
  ADD UNIQUE KEY `uq_academic_year_code` (`code`);

--
-- Indices de la tabla `academic_year_course`
--
ALTER TABLE `academic_year_course`
  ADD PRIMARY KEY (`academic_year_id`,`course_id`),
  ADD KEY `IDX_2a3dd076ff7c8c35b300cb68c4` (`academic_year_id`),
  ADD KEY `IDX_824afe0984bf7944ab95d80485` (`course_id`);

--
-- Indices de la tabla `access_log`
--
ALTER TABLE `access_log`
  ADD PRIMARY KEY (`access_log_id`),
  ADD KEY `idx_access_log_tag_id` (`tag_id`),
  ADD KEY `idx_access_log_user` (`user_id`),
  ADD KEY `idx_access_log_reader_id` (`reader_id`),
  ADD KEY `idx_access_log_room_id` (`room_id`),
  ADD KEY `idx_access_log_subject_id` (`subject_id`);

--
-- Indices de la tabla `blacklist_token`
--
ALTER TABLE `blacklist_token`
  ADD PRIMARY KEY (`user_id`,`token`);

--
-- Indices de la tabla `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `uq_course_code` (`course_code`),
  ADD KEY `idx_course_level` (`education_stage`,`level_number`,`cf_level`);

--
-- Indices de la tabla `course_subject`
--
ALTER TABLE `course_subject`
  ADD PRIMARY KEY (`course_id`,`subject_id`),
  ADD KEY `IDX_00a5bee2c4b7053ae77478fe32` (`course_id`),
  ADD KEY `IDX_49b3882567e1f74ddc36ff2d05` (`subject_id`);

--
-- Indices de la tabla `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indices de la tabla `event_schedule`
--
ALTER TABLE `event_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `idx_event_time` (`start_at`,`end_at`);

--
-- Indices de la tabla `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indices de la tabla `notification_user`
--
ALTER TABLE `notification_user`
  ADD PRIMARY KEY (`user_id`,`notification_id`),
  ADD KEY `IDX_549f25e238a1be8a4ed7ec0ac3` (`user_id`),
  ADD KEY `IDX_cc974855ce8c702dfed67deaaa` (`notification_id`);

--
-- Indices de la tabla `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD PRIMARY KEY (`token`,`user_id`),
  ADD KEY `FK_7eabb22ed38459ffc24dc8b415d` (`user_id`);

--
-- Indices de la tabla `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`user_id`,`room_id`,`schedule_id`),
  ADD KEY `idx_permission_user` (`user_id`),
  ADD KEY `idx_permission_room` (`room_id`),
  ADD KEY `idx_permission_schedule` (`schedule_id`),
  ADD KEY `FK_9c4a4f3953767dfc5d1a3b63d10` (`created_by`);

--
-- Indices de la tabla `reader`
--
ALTER TABLE `reader`
  ADD PRIMARY KEY (`reader_id`),
  ADD UNIQUE KEY `uq_reader_code` (`reader_code`),
  ADD KEY `idx_reader_room` (`room_id`);

--
-- Indices de la tabla `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `uq_role_name` (`name`);

--
-- Indices de la tabla `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `IDX_5261e26da61ccaf8aeda8bca8e` (`user_id`),
  ADD KEY `IDX_78ee37f2db349d230d502b1c7e` (`role_id`);

--
-- Indices de la tabla `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `uq_room_code` (`room_code`),
  ADD UNIQUE KEY `IDX_6d325fb24713ad6a855244957d` (`course_id`),
  ADD UNIQUE KEY `REL_6d325fb24713ad6a855244957d` (`course_id`),
  ADD KEY `idx_room_course` (`course_id`);

--
-- Indices de la tabla `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `idx_schedule_type` (`type`),
  ADD KEY `idx_schedule_year` (`academic_year_id`);

--
-- Indices de la tabla `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `uq_subject_code` (`subject_code`),
  ADD KEY `idx_subject_department` (`department_id`);

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `uq_tag_code` (`tag_code`),
  ADD KEY `idx_tag_user` (`user_id`);

--
-- Indices de la tabla `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idx_teacher_department` (`department_id`);

--
-- Indices de la tabla `teacher_subject`
--
ALTER TABLE `teacher_subject`
  ADD PRIMARY KEY (`user_id`,`subject_id`),
  ADD KEY `IDX_390d62f87e6a051253a5320ea2` (`user_id`),
  ADD KEY `IDX_c876c0444684d4812824989ba2` (`subject_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- Indices de la tabla `weekly_schedule`
--
ALTER TABLE `weekly_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `idx_weekly_dow` (`day_of_week`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `academic_year`
--
ALTER TABLE `academic_year`
  MODIFY `academic_year_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `access_log`
--
ALTER TABLE `access_log`
  MODIFY `access_log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `department`
--
ALTER TABLE `department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `notification`
--
ALTER TABLE `notification`
  MODIFY `notification_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reader`
--
ALTER TABLE `reader`
  MODIFY `reader_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `room`
--
ALTER TABLE `room`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `schedule`
--
ALTER TABLE `schedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `academic_year_course`
--
ALTER TABLE `academic_year_course`
  ADD CONSTRAINT `FK_2a3dd076ff7c8c35b300cb68c42` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_824afe0984bf7944ab95d804855` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `access_log`
--
ALTER TABLE `access_log`
  ADD CONSTRAINT `FK_110bdd4c40a808f3d6e316dddbc` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_14b6cced5b2e79c2f1dc14642e3` FOREIGN KEY (`reader_id`) REFERENCES `reader` (`reader_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_9b8f36d552efbdded0773cac74d` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ead7bd82ecee9aa471fb03692f5` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ffd700ee1424928473e1c177c69` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `blacklist_token`
--
ALTER TABLE `blacklist_token`
  ADD CONSTRAINT `FK_a86542709c00804d88dac52a1d4` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `course_subject`
--
ALTER TABLE `course_subject`
  ADD CONSTRAINT `FK_00a5bee2c4b7053ae77478fe32c` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_49b3882567e1f74ddc36ff2d05e` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `event_schedule`
--
ALTER TABLE `event_schedule`
  ADD CONSTRAINT `FK_d3541a509f4354f04b0d007cc67` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `notification_user`
--
ALTER TABLE `notification_user`
  ADD CONSTRAINT `FK_549f25e238a1be8a4ed7ec0ac33` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_cc974855ce8c702dfed67deaaa7` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD CONSTRAINT `FK_7eabb22ed38459ffc24dc8b415d` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `permission`
--
ALTER TABLE `permission`
  ADD CONSTRAINT `FK_52ae3a8cd2bb3c61d7fa1c6b12e` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_85fd07c06d32a2f92cb40c9e308` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8ec1323d871577a8795e54c9c4b` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_9c4a4f3953767dfc5d1a3b63d10` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `reader`
--
ALTER TABLE `reader`
  ADD CONSTRAINT `FK_65b11beca268da2e1c904315732` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `role_user`
--
ALTER TABLE `role_user`
  ADD CONSTRAINT `FK_5261e26da61ccaf8aeda8bca8ea` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_78ee37f2db349d230d502b1c7ea` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `FK_6d325fb24713ad6a855244957da` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `FK_d0bc0f79a509a8cb0b60c1a3a44` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`academic_year_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `FK_7260897020fde2543677eb132ad` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `FK_d0be05b78e89aff4791e6189f77` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `FK_93f6fa64874b010c5f3a87c3b8b` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_9544efb08825bd4c3893ba4dd19` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `teacher_subject`
--
ALTER TABLE `teacher_subject`
  ADD CONSTRAINT `FK_390d62f87e6a051253a5320ea2e` FOREIGN KEY (`user_id`) REFERENCES `teacher` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_c876c0444684d4812824989ba2c` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `weekly_schedule`
--
ALTER TABLE `weekly_schedule`
  ADD CONSTRAINT `FK_182d03b033f3f549fa936756295` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
