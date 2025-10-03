/* ===========================================================
    AulaSegura - MariaDB
   =========================================================== */

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

/* ---------- DROPS (orden seguro) ---------- */
DROP TABLE IF EXISTS `access_log`;
DROP TABLE IF EXISTS `permission`;
DROP TABLE IF EXISTS `event_schedule`;
DROP TABLE IF EXISTS `weekly_schedule`;
DROP TABLE IF EXISTS `schedule`;
DROP TABLE IF EXISTS `reader`;
DROP TABLE IF EXISTS `room`;
DROP TABLE IF EXISTS `tag`;
DROP TABLE IF EXISTS `teacher_subject`;
DROP TABLE IF EXISTS `teacher`;
DROP TABLE IF EXISTS `subject_course`;
DROP TABLE IF EXISTS `subject`;
DROP TABLE IF EXISTS `department`;
DROP TABLE IF EXISTS `course`;
DROP TABLE IF EXISTS `academic_year`;
DROP TABLE IF EXISTS `notification_user`;
DROP TABLE IF EXISTS `notification`;
DROP TABLE IF EXISTS `role_user`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `blacklist_token`;
DROP TABLE IF EXISTS `refresh_token`;
DROP TABLE IF EXISTS `user`;

/* ===========================================================
    1) CREATE TABLES (sin claves foráneas)
   =========================================================== */

/* user */
CREATE TABLE `user` (
  `user_id` CHAR(36) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(60) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `valid_from` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_to` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* role */
CREATE TABLE `role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `name` ENUM('admin','teacher','janitor','support_staff') NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_role_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* role_user */
CREATE TABLE `role_user` (
  `user_id` CHAR(36) NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `idx_role_user_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* notification */
CREATE TABLE `notification` (
  `notification_id` BIGINT NOT NULL AUTO_INCREMENT,
  `type` ENUM('access','warning','alert') NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `body` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* notification_user */
CREATE TABLE `notification_user` (
  `user_id` CHAR(36) NOT NULL,
  `notification_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`,`notification_id`),
  KEY `idx_notification_user_notification` (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* refresh_token */
CREATE TABLE `refresh_token` (
  `user_id` CHAR(36) NOT NULL,
  `refresh_token` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`user_id`,`refresh_token`),
  UNIQUE KEY `uq_refresh_token` (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* blacklist_token */
CREATE TABLE `blacklist_token` (
  `user_id` CHAR(36) NOT NULL,
  `refresh_token` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`user_id`,`refresh_token`),
  UNIQUE KEY `uq_blacklist_token` (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* academic_year */
CREATE TABLE `academic_year` (
  `academic_year_id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`academic_year_id`),
  UNIQUE KEY `uq_academic_year_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* course */
CREATE TABLE `course` (
  `course_id` INT NOT NULL AUTO_INCREMENT,
  `course_code` VARCHAR(20) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `academic_year_id` INT NOT NULL,
  `level` ENUM('ESO','bachillerato','FP') NOT NULL,
  `stage` TINYINT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `uq_course_code` (`course_code`),
  KEY `idx_course_year` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* department */
CREATE TABLE `department` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* subject */
CREATE TABLE `subject` (
  `subject_id` BIGINT NOT NULL AUTO_INCREMENT,
  `subject_code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `department_id` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`subject_id`),
  UNIQUE KEY `uq_subject_code` (`subject_code`),
  KEY `idx_subject_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* subject_course */
CREATE TABLE `subject_course` (
  `subject_id` BIGINT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`subject_id`,`course_id`),
  KEY `idx_subject_course_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* teacher */
CREATE TABLE `teacher` (
  `user_id` CHAR(36) NOT NULL,
  `department_id` INT NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `idx_teacher_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* teacher_subject */
CREATE TABLE `teacher_subject` (
  `user_id` CHAR(36) NOT NULL,
  `subject_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`,`subject_id`),
  KEY `idx_teacher_subject_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* room */
CREATE TABLE `room` (
  `room_id` INT NOT NULL AUTO_INCREMENT,
  `room_code` VARCHAR(20) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `course_id` INT UNIQUE DEFAULT NULL,
  `capacity` SMALLINT NOT NULL,
  `floor` ENUM('P1','P2') NOT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `uq_room_code` (`room_code`),
  KEY `idx_room_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* reader */
CREATE TABLE `reader` (
  `reader_id` INT NOT NULL AUTO_INCREMENT,
  `reader_code` VARCHAR(50) NOT NULL,
  `room_id` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`reader_id`),
  UNIQUE KEY `uq_reader_code` (`reader_code`),
  KEY `idx_reader_room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* tag (RFID / NFC móvil) */
CREATE TABLE `tag` (
  `tag_id` BIGINT NOT NULL AUTO_INCREMENT,
  `tag_code` VARCHAR(64) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `type` ENUM('rfid','nfc_mobile') NOT NULL DEFAULT 'rfid',
  `device_id` VARCHAR(100) DEFAULT NULL,
  `issued_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `uq_tag_code` (`tag_code`),
  KEY `idx_tag_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* schedule (padre) */
CREATE TABLE `schedule` (
  `schedule_id` BIGINT NOT NULL AUTO_INCREMENT,
  `type` ENUM('weekly','event') NOT NULL,
  `academic_year_id` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`schedule_id`),
  KEY `idx_schedule_year` (`academic_year_id`),
  KEY `idx_schedule_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* weekly_schedule (hija 1:1) */
CREATE TABLE `weekly_schedule` (
  `schedule_id` BIGINT NOT NULL,
  `day_of_week` TINYINT NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `valid_from` DATE NOT NULL,
  `valid_to` DATE DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `idx_weekly_dow` (`day_of_week`,`valid_from`,`valid_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* event_schedule (hija 1:1) */
CREATE TABLE `event_schedule` (
  `schedule_id` BIGINT NOT NULL,
  `type` ENUM('reservation','temp_pass') NOT NULL,
  `start_at` DATETIME NOT NULL,
  `end_at` DATETIME NOT NULL,
  `status` ENUM('pending','approved','revoked','active','expired') NOT NULL DEFAULT 'pending',
  `reason` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `idx_event_time` (`start_at`,`end_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* permission */
CREATE TABLE `permission` (
  `user_id` CHAR(36) NOT NULL,
  `room_id` INT NOT NULL,
  `schedule_id` BIGINT NOT NULL,
  `created_by` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`user_id`,`room_id`,`schedule_id`),
  KEY `idx_permission_room` (`room_id`),
  KEY `idx_permission_schedule` (`schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* access_log */
CREATE TABLE `access_log` (
  `access_log_id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tag_code` VARCHAR(64) NOT NULL,
  `reader_code` VARCHAR(50) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `subject_code` VARCHAR(50) DEFAULT NULL,
  `classroom_code` VARCHAR(20) NOT NULL,
  `status` ENUM('allowed','denied','exit','timeout') NOT NULL,
  `access_method` ENUM('rfid','nfc','qr') NOT NULL,
  PRIMARY KEY (`access_log_id`),
  KEY `idx_access_log_user` (`user_id`),
  KEY `idx_access_log_reader_code` (`reader_code`),
  KEY `idx_access_log_tag_code` (`tag_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

/* ===========================================================
    2) FOREIGN KEYS (ALTER TABLE ... ADD CONSTRAINT)
   =========================================================== */

ALTER TABLE `role_user`
  ADD CONSTRAINT `fk_role_user_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
  ADD CONSTRAINT `fk_role_user_role` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`);

ALTER TABLE `notification_user`
  ADD CONSTRAINT `fk_notification_user_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
  ADD CONSTRAINT `fk_notification_user_notification` FOREIGN KEY (`notification_id`) REFERENCES `notification`(`notification_id`);

ALTER TABLE `refresh_token`
  ADD CONSTRAINT `fk_refresh_token_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`);

ALTER TABLE `blacklist_token`
  ADD CONSTRAINT `fk_blacklist_token_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`);

ALTER TABLE `course`
  ADD CONSTRAINT `fk_course_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year`(`academic_year_id`);

ALTER TABLE `subject`
  ADD CONSTRAINT `fk_subject_department` FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`);

ALTER TABLE `subject_course`
  ADD CONSTRAINT `fk_subject_course_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`subject_id`),
  ADD CONSTRAINT `fk_subject_course_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`);

ALTER TABLE `teacher`
  ADD CONSTRAINT `fk_teacher_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
  ADD CONSTRAINT `fk_teacher_department` FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`);

ALTER TABLE `teacher_subject`
  ADD CONSTRAINT `fk_teacher_subject_teacher` FOREIGN KEY (`user_id`) REFERENCES `teacher`(`user_id`),
  ADD CONSTRAINT `fk_teacher_subject_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`subject_id`);

ALTER TABLE `room`
  ADD CONSTRAINT `fk_room_course` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`);

ALTER TABLE `reader`
  ADD CONSTRAINT `fk_reader_room` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`);

ALTER TABLE `tag`
  ADD CONSTRAINT `fk_tag_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`);

ALTER TABLE `schedule`
  ADD CONSTRAINT `fk_schedule_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year`(`academic_year_id`);

ALTER TABLE `weekly_schedule`
  ADD CONSTRAINT `fk_weekly_schedule_parent` FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`schedule_id`) ON DELETE CASCADE;

ALTER TABLE `event_schedule`
  ADD CONSTRAINT `fk_event_schedule_parent` FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`schedule_id`) ON DELETE CASCADE;

ALTER TABLE `permission`
  ADD CONSTRAINT `fk_permission_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
  ADD CONSTRAINT `fk_permission_room` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`),
  ADD CONSTRAINT `fk_permission_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`schedule_id`),
  ADD CONSTRAINT `fk_permission_created_by` FOREIGN KEY (`created_by`) REFERENCES `user`(`user_id`);

ALTER TABLE `access_log`
  ADD CONSTRAINT `fk_access_log_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
  ADD CONSTRAINT `fk_access_log_tag_code` FOREIGN KEY (`tag_code`) REFERENCES `tag`(`tag_code`),
  ADD CONSTRAINT `fk_access_log_reader_code` FOREIGN KEY (`reader_code`) REFERENCES `reader`(`reader_code`),
  ADD CONSTRAINT `fk_access_log_room_code` FOREIGN KEY (`classroom_code`) REFERENCES `room`(`room_code`),
  ADD CONSTRAINT `fk_access_log_subject_code` FOREIGN KEY (`subject_code`) REFERENCES `subject`(`subject_code`);

/* ===========================================================
    3) DUMMIES
   =========================================================== */

START TRANSACTION;

/* Año académico */
INSERT INTO academic_year (code, is_active) VALUES ('2025-2026', TRUE);
SET @AY := LAST_INSERT_ID();

/* Roles */
INSERT INTO role (name) VALUES ('admin'),('teacher'),('janitor'),('support_staff');
SET @ROLE_ADMIN  := (SELECT role_id FROM role WHERE name='admin');
SET @ROLE_TEACH  := (SELECT role_id FROM role WHERE name='teacher');
SET @ROLE_JANIT  := (SELECT role_id FROM role WHERE name='janitor');
SET @ROLE_SUPPT  := (SELECT role_id FROM role WHERE name='support_staff');

/* Usuarios (UUIDs ejemplo) */
SET @U_ADMIN := '00000000-0000-0000-0000-000000000001';
SET @U_TEACH := '00000000-0000-0000-0000-000000000002';
SET @U_JANIT := '00000000-0000-0000-0000-000000000003';
SET @U_SUPPT := '00000000-0000-0000-0000-000000000004';

/* Passwords (hashes bcrypt de 'temporal123') */
SET @PWD1 := '$2b$12$oqtmAKfZU0z/VHWlXBjAHOxFT0azngUga6y2H0pWZRVjtIffhRSdy';
SET @PWD2 := '$2b$12$jAI8f4/JEH.Wa0K71mS14eepyxHNRkUzfPRRfk43Vtk7Tl3Ez7Iqq';
SET @PWD3 := '$2b$12$ZhGMpI.MszovbjjMI9AwouVDm5c4HOyUnULOn1/vQRN3q.SalDWrS';
SET @PWD4 := '$2b$12$DD.ynj6xstst.zFh7bQ7.upYmi1nW4H88Altfo9C/KfxxZZFcbbHS';

INSERT INTO `user` (user_id, name, lastname, email, password_hash, avatar, valid_from, valid_to)
VALUES
(@U_ADMIN, 'Ana',  'Dirección', 'admin@ies.local',   @PWD1, NULL, NOW(), NULL),
(@U_TEACH, 'Luis', 'Profe',     'teacher@ies.local', @PWD2, NULL, NOW(), NULL),
(@U_JANIT, 'Marta','Conserje',  'janitor@ies.local', @PWD3, NULL, NOW(), NULL),
(@U_SUPPT, 'Eva',  'PAS',       'staff@ies.local',   @PWD4, NULL, NOW(), NULL);

/* Roles asignados */
INSERT INTO role_user (user_id, role_id) VALUES
(@U_ADMIN, @ROLE_ADMIN),
(@U_TEACH, @ROLE_TEACH),
(@U_JANIT, @ROLE_JANIT),
(@U_SUPPT, @ROLE_SUPPT);

/* Departamento y profesor */
INSERT INTO department (name) VALUES ('Matemáticas');
SET @DEPT_MATH := LAST_INSERT_ID();

INSERT INTO teacher (user_id, department_id) VALUES (@U_TEACH, @DEPT_MATH);

/* Asignatura y curso */
INSERT INTO subject (subject_code, name, department_id, is_active)
VALUES ('MATES-ESO', 'Matemáticas ESO', @DEPT_MATH, TRUE);
SET @SUBJ_MATH := LAST_INSERT_ID();

INSERT INTO course (course_code, name, academic_year_id, level, stage, is_active)
VALUES ('3ESO-A', '3º ESO A', @AY, 'ESO', 3, TRUE);
SET @COURSE_3ESOA := LAST_INSERT_ID();

INSERT INTO subject_course (subject_id, course_id) VALUES (@SUBJ_MATH, @COURSE_3ESOA);

/* Aula y lector */
INSERT INTO room (room_code, name, course_id, capacity, floor)
VALUES ('A-2.08', 'Aula 2.08', @COURSE_3ESOA, 30, 'P2');
SET @ROOM_208 := LAST_INSERT_ID();

INSERT INTO reader (reader_code, room_id, is_active)
VALUES ('READER-A208', @ROOM_208, TRUE);

/* Tags: RFID y NFC móvil */
INSERT INTO tag (tag_code, user_id, type, device_id, is_active)
VALUES
('TAG-ADMIN-001',  @U_ADMIN, 'rfid',       NULL, TRUE),
('TAG-TEACH-RFID', @U_TEACH, 'rfid',       NULL, TRUE),
('TAG-TEACH-NFC1', @U_TEACH, 'nfc_mobile', 'android-uuid-1', TRUE),
('TAG-JANIT-001',  @U_JANIT, 'rfid',       NULL, TRUE),
('TAG-SUPPT-001',  @U_SUPPT, 'rfid',       NULL, TRUE);

/* Weekly schedule (Teacher) Lunes 10:00–12:00 (ISO: 1=Lunes) */
INSERT INTO schedule (`type`, academic_year_id, is_active)
VALUES ('weekly', @AY, TRUE);
SET @SCH_WEEKLY := LAST_INSERT_ID();

INSERT INTO weekly_schedule (schedule_id, day_of_week, start_time, end_time, valid_from, valid_to)
VALUES (@SCH_WEEKLY, 1, '10:00:00', '12:00:00', '2025-09-01', NULL);

/* Permiso weekly del Teacher en Aula A-2.08 (creado por Admin) */
INSERT INTO permission (user_id, room_id, schedule_id, created_by)
VALUES (@U_TEACH, @ROOM_208, @SCH_WEEKLY, @U_ADMIN);

/* Event: reserva aprobada (Teacher) 2025-11-15 16:00–18:00 */
INSERT INTO schedule (`type`, academic_year_id, is_active)
VALUES ('event', @AY, TRUE);
SET @SCH_EVENT_RES := LAST_INSERT_ID();

INSERT INTO event_schedule (schedule_id, `type`, start_at, end_at, status, reason)
VALUES (@SCH_EVENT_RES, 'reservation', '2025-11-15 16:00:00', '2025-11-15 18:00:00', 'approved', 'Preparación examen');

INSERT INTO permission (user_id, room_id, schedule_id, created_by)
VALUES (@U_TEACH, @ROOM_208, @SCH_EVENT_RES, @U_ADMIN);

/* Event: temp_pass activo (Janitor → Support Staff) 2025-11-16 08:00–10:00 */
INSERT INTO schedule (`type`, academic_year_id, is_active)
VALUES ('event', @AY, TRUE);
SET @SCH_EVENT_PASS := LAST_INSERT_ID();

INSERT INTO event_schedule (schedule_id, `type`, start_at, end_at, status, reason)
VALUES (@SCH_EVENT_PASS, 'temp_pass', '2025-11-16 08:00:00', '2025-11-16 10:00:00', 'active', 'Limpieza puntual');

INSERT INTO permission (user_id, room_id, schedule_id, created_by)
VALUES (@U_SUPPT, @ROOM_208, @SCH_EVENT_PASS, @U_JANIT);

/* Notificaciones (ejemplo) */
INSERT INTO notification (type, title, body) VALUES
('access','Reserva aprobada','Tu reserva del 15/11 16-18 ha sido aprobada.'),
('warning','Lector A-2.08 lento','Se detecta latencia elevada.');

INSERT INTO notification_user (user_id, notification_id)
SELECT @U_TEACH, n.notification_id FROM notification n WHERE n.type='access' LIMIT 1;

/* Logs de acceso (rfid/nfc/qr) */
INSERT INTO access_log (created_at, tag_code, reader_code, user_id, subject_code, classroom_code, status, access_method)
VALUES
(NOW(),                 'TAG-TEACH-RFID', 'READER-A208', @U_TEACH, 'MATES-ESO', 'A-2.08', 'allowed', 'rfid'),
('2025-11-15 16:05:00', 'TAG-TEACH-NFC1', 'READER-A208', @U_TEACH, 'MATES-ESO', 'A-2.08', 'allowed', 'nfc'),
('2025-11-16 08:10:00', 'TAG-SUPPT-001',  'READER-A208', @U_SUPPT, NULL,        'A-2.08', 'allowed', 'rfid'),
(NOW(),                 'TAG-TEACH-RFID', 'READER-A208', @U_TEACH, 'MATES-ESO', 'A-2.08', 'denied',  'qr');

COMMIT;