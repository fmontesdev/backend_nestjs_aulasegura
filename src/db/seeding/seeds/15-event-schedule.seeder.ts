import { DataSource } from 'typeorm';

export const seedEventSchedules = async (dataSource: DataSource): Promise<void> => {
  // Insertar event_schedule (6 reservas/temp_pass)
  await dataSource.query(`
    INSERT INTO event_schedule (type, start_at, end_at, status, schedule_id, description, reservation_status_reason) VALUES
    ('temp_pass', '2025-11-12 10:00:00', '2025-11-12 11:00:00', 'approved', 87, 'Reserva de aula', NULL),
    ('temp_pass', '2025-11-18 11:00:00', '2025-11-18 23:55:00', 'approved', 88, 'Reserva de aula', NULL),
    ('reservation', '2025-11-24 10:00:00', '2025-11-24 11:00:00', 'approved', 90, 'Reserva de aula', NULL),
    ('reservation', '2025-11-28 15:10:00', '2025-11-28 17:55:00', 'pending', 97, 'Reserva de aula', NULL),
    ('reservation', '2025-11-27 08:55:00', '2025-11-27 12:05:00', 'pending', 109, 'Reserva de aula', NULL),
    ('reservation', '2025-11-26 19:10:00', '2025-11-26 20:05:00', 'pending', 113, 'Reserva de aula', NULL)
    ON DUPLICATE KEY UPDATE schedule_id = schedule_id
  `);

  console.log('Event schedules created (6 events: 2 temp_pass + 4 reservations)');
};
