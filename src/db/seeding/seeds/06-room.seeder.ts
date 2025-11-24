import { DataSource } from 'typeorm';
import { RoomEntity } from '../../../rooms/domain/entities/room.entity';

export const seedRooms = async (dataSource: DataSource): Promise<void> => {
  const roomRepo = dataSource.getRepository(RoomEntity);

  const rooms = [
    { roomId: 1, roomCode: '1', name: 'Aula', courseId: null, capacity: 20, building: 1, floor: 1, isActive: true },
    { roomId: 2, roomCode: '2', name: 'Tecnología 1 - Aula', courseId: null, capacity: 25, building: 1, floor: 1, isActive: true },
    { roomId: 3, roomCode: '4', name: 'Almacén central', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 4, roomCode: '5', name: 'Limpieza', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 5, roomCode: '6', name: 'Archivo', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 6, roomCode: '7', name: 'Visitas', courseId: null, capacity: 8, building: 1, floor: 1, isActive: true },
    { roomId: 7, roomCode: '8', name: 'Dirección', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 8, roomCode: '9', name: 'Aula', courseId: null, capacity: 20, building: 1, floor: 1, isActive: true },
    { roomId: 9, roomCode: '10', name: 'Aula', courseId: null, capacity: 20, building: 1, floor: 1, isActive: true },
    { roomId: 10, roomCode: '11', name: 'Almacén secretaría', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 11, roomCode: '12', name: 'Biblioteca', courseId: null, capacity: 15, building: 1, floor: 1, isActive: true },
    { roomId: 12, roomCode: '13', name: 'Tecnología 2 - Aula', courseId: null, capacity: 20, building: 1, floor: 1, isActive: true },
    { roomId: 13, roomCode: '15', name: 'Administración', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 14, roomCode: '16', name: 'Jefes de Estudios', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 15, roomCode: '17', name: 'FCT', courseId: null, capacity: 7, building: 1, floor: 1, isActive: true },
    { roomId: 16, roomCode: '18', name: 'Almacén', courseId: null, capacity: 0, building: 1, floor: 1, isActive: true },
    { roomId: 17, roomCode: '19', name: 'Aula', courseId: null, capacity: 20, building: 1, floor: 1, isActive: true },
    { roomId: 18, roomCode: '20', name: 'Gimnasio', courseId: null, capacity: 50, building: 1, floor: 1, isActive: true },
    { roomId: 19, roomCode: '20A', name: 'Vestuario2', courseId: null, capacity: 15, building: 2, floor: 1, isActive: true },
    { roomId: 20, roomCode: '21', name: 'Vestuario1', courseId: null, capacity: 15, building: 2, floor: 1, isActive: true },
    { roomId: 21, roomCode: '22', name: 'Materiales', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 22, roomCode: '23', name: 'D1', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 23, roomCode: '24', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 24, roomCode: '25', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 25, roomCode: '26', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 26, roomCode: '27', name: 'DESDBL - OT', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 27, roomCode: '30', name: 'Conserjería', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 28, roomCode: '31', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 29, roomCode: '32', name: 'OT.B', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 30, roomCode: '33', name: 'OT.A', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 31, roomCode: '34', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 32, roomCode: '35', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 33, roomCode: '35A', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 34, roomCode: '36', name: 'Música 1 - Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 35, roomCode: '37', name: 'Aula', courseId: null, capacity: 15, building: 2, floor: 1, isActive: true },
    { roomId: 36, roomCode: '38', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 37, roomCode: '39', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 38, roomCode: '40', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 39, roomCode: '44', name: 'Almacén', courseId: null, capacity: 0, building: 2, floor: 1, isActive: true },
    { roomId: 40, roomCode: '45', name: 'Cafetería', courseId: null, capacity: 50, building: 2, floor: 1, isActive: true },
    { roomId: 41, roomCode: '46', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 42, roomCode: '47', name: 'Aula', courseId: null, capacity: 20, building: 2, floor: 1, isActive: true },
    { roomId: 43, roomCode: '48', name: 'Música 2 - Lenguaje Musical - Aula', courseId: null, capacity: 15, building: 2, floor: 1, isActive: true },
    { roomId: 44, roomCode: '49', name: 'Música - D2 Piano - Aula', courseId: null, capacity: 7, building: 2, floor: 1, isActive: true },
    { roomId: 45, roomCode: '50', name: 'Música - D3 - Aula', courseId: null, capacity: 7, building: 2, floor: 1, isActive: true },
    { roomId: 46, roomCode: '51', name: 'Música - D4 - Aula', courseId: null, capacity: 7, building: 2, floor: 1, isActive: true },
  ];

  for (const data of rooms) {
    const exists = await roomRepo.findOne({ where: { roomId: data.roomId } });
    if (!exists) {
      const room = roomRepo.create(data);
      await roomRepo.save(room);
      console.log(`Room created: ${data.name} (${data.roomCode})`);
    } else {
      console.log(`Room already exists: ${data.name} (${data.roomCode})`);
    }
  }
};
