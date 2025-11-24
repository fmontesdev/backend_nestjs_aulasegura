import { DataSource } from 'typeorm';
import { ReaderEntity } from '../../../readers/domain/entities/reader.entity';

export const seedReaders = async (dataSource: DataSource): Promise<void> => {
  const readerRepo = dataSource.getRepository(ReaderEntity);

  const readers = [
    { readerId: 1, readerCode: 'READER-AULA-1', roomId: 1, isActive: true },
    { readerId: 2, readerCode: 'READER-TECNOLOGIA1', roomId: 2, isActive: true },
    { readerId: 3, readerCode: 'READER-ALMACEN-CENTRAL', roomId: 3, isActive: true },
    { readerId: 4, readerCode: 'READER-LIMPIEZA', roomId: 4, isActive: true },
    { readerId: 5, readerCode: 'READER-ARCHIVO', roomId: 5, isActive: true },
    { readerId: 6, readerCode: 'READER-VISITAS', roomId: 6, isActive: true },
    { readerId: 7, readerCode: 'READER-DIRECCION', roomId: 7, isActive: true },
    { readerId: 8, readerCode: 'READER-AULA-9', roomId: 8, isActive: true },
    { readerId: 9, readerCode: 'READER-AULA-10', roomId: 9, isActive: true },
    { readerId: 10, readerCode: 'READER-ALMACEN-SECRETARIA', roomId: 10, isActive: true },
    { readerId: 11, readerCode: 'READER-BIBLIOTECA', roomId: 11, isActive: true },
    { readerId: 12, readerCode: 'READER-TECNOLOGIA2', roomId: 12, isActive: true },
    { readerId: 13, readerCode: 'READER-ADMINISTRACION', roomId: 13, isActive: true },
    { readerId: 14, readerCode: 'READER-JEFES-ESTUDIOS', roomId: 14, isActive: true },
    { readerId: 15, readerCode: 'READER-FCT', roomId: 15, isActive: true },
    { readerId: 16, readerCode: 'READER-ALMACEN-18', roomId: 16, isActive: true },
    { readerId: 17, readerCode: 'READER-AULA-19', roomId: 17, isActive: true },
    { readerId: 18, readerCode: 'READER-GIMNASIO', roomId: 18, isActive: true },
    { readerId: 19, readerCode: 'READER-VESTUARIO2', roomId: 19, isActive: true },
    { readerId: 20, readerCode: 'READER-VESTUARIO1', roomId: 20, isActive: true },
    { readerId: 21, readerCode: 'READER-MATERIALES', roomId: 21, isActive: true },
    { readerId: 22, readerCode: 'READER-D1', roomId: 22, isActive: true },
    { readerId: 23, readerCode: 'READER-AULA-24', roomId: 23, isActive: true },
    { readerId: 24, readerCode: 'READER-AULA-25', roomId: 24, isActive: true },
    { readerId: 25, readerCode: 'READER-AULA-26', roomId: 25, isActive: true },
    { readerId: 26, readerCode: 'READER-DESDBL-OT', roomId: 26, isActive: true },
    { readerId: 27, readerCode: 'READER-CONSERJERIA', roomId: 27, isActive: true },
    { readerId: 28, readerCode: 'READER-AULA-31', roomId: 28, isActive: true },
    { readerId: 29, readerCode: 'READER-OTB', roomId: 29, isActive: true },
    { readerId: 30, readerCode: 'READER-OTA', roomId: 30, isActive: true },
    { readerId: 31, readerCode: 'READER-AULA-34', roomId: 31, isActive: true },
    { readerId: 32, readerCode: 'READER-AULA-35', roomId: 32, isActive: true },
    { readerId: 33, readerCode: 'READER-AULA-35A', roomId: 33, isActive: true },
    { readerId: 34, readerCode: 'READER-MUSICA1', roomId: 34, isActive: true },
    { readerId: 35, readerCode: 'READER-AULA-37', roomId: 35, isActive: true },
    { readerId: 36, readerCode: 'READER-AULA-38', roomId: 36, isActive: true },
    { readerId: 37, readerCode: 'READER-AULA-39', roomId: 37, isActive: true },
    { readerId: 38, readerCode: 'READER-AULA-40', roomId: 38, isActive: true },
    { readerId: 39, readerCode: 'READER-ALMACEN-44', roomId: 39, isActive: true },
    { readerId: 40, readerCode: 'READER-CAFETERIA', roomId: 40, isActive: true },
    { readerId: 41, readerCode: 'READER-AULA-46', roomId: 41, isActive: true },
    { readerId: 42, readerCode: 'READER-AULA-47', roomId: 42, isActive: true },
    { readerId: 43, readerCode: 'READER-MUSICA2-LM', roomId: 43, isActive: true },
    { readerId: 44, readerCode: 'READER-MUSICA-D2-PIANO', roomId: 44, isActive: true },
    { readerId: 45, readerCode: 'READER-MUSICA-D3', roomId: 45, isActive: true },
    { readerId: 46, readerCode: 'READER-MUSICA-D4', roomId: 46, isActive: true },
  ];

  for (const data of readers) {
    const exists = await readerRepo.findOne({ where: { readerId: data.readerId } });
    if (!exists) {
      const reader = readerRepo.create(data);
      await readerRepo.save(reader);
      console.log(`✅ Reader created: ${data.readerCode}`);
    } else {
      console.log(`⏭️  Reader already exists: ${data.readerCode}`);
    }
  }
};
