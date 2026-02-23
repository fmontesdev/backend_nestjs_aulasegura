import { DataSource } from 'typeorm';
import { DepartmentEntity } from '../../../departments/domain/entities/department.entity';

export const seedDepartments = async (dataSource: DataSource): Promise<void> => {
  const departmentRepo = dataSource.getRepository(DepartmentEntity);

  const departments = [
    { departmentId: 1, name: 'Artes plásticas', isActive: true },
    { departmentId: 2, name: 'Biología y Geología', isActive: true },
    { departmentId: 3, name: 'Economía', isActive: true },
    { departmentId: 4, name: 'Educación Física', isActive: true },
    { departmentId: 5, name: 'Administración', isActive: true },
    { departmentId: 6, name: 'Comercio', isActive: true },
    { departmentId: 7, name: 'Informática', isActive: true },
    { departmentId: 8, name: 'Filosofía', isActive: true },
    { departmentId: 9, name: 'Física y Química', isActive: true },
    { departmentId: 10, name: 'Fol', isActive: true },
    { departmentId: 11, name: 'Francés', isActive: true },
    { departmentId: 12, name: 'Geografía e Historia', isActive: true },
    { departmentId: 13, name: 'Inglés', isActive: true },
    { departmentId: 14, name: 'Latín', isActive: true },
    { departmentId: 15, name: 'Castellano', isActive: true },
    { departmentId: 16, name: 'Valenciano', isActive: true },
    { departmentId: 17, name: 'Matemáticas', isActive: true },
    { departmentId: 18, name: 'Música', isActive: true },
    { departmentId: 19, name: 'Orientación', isActive: true },
    { departmentId: 20, name: 'Religión', isActive: true },
    { departmentId: 21, name: 'Tecnología', isActive: true },
    { departmentId: 22, name: 'Nuevo', isActive: true },
  ];

  for (const data of departments) {
    const exists = await departmentRepo.findOne({ where: { departmentId: data.departmentId } });
    if (!exists) {
      const department = departmentRepo.create(data);
      await departmentRepo.save(department);
      console.log(`Department created: ${data.name}`);
    } else {
      console.log(`Department already exists: ${data.name}`);
    }
  }
};
