import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import userData from '../../../data/user';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TeacherEntity } from '../../../users/domain/entities/teacher.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { RoleEntity } from '../../../users/domain/entities/role.entity';
import { hash as bcryptHash } from '@node-rs/bcrypt';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(UserEntity);
    const roleRepo = dataSource.getRepository(RoleEntity);
    const teacherRepo = dataSource.getRepository(TeacherEntity);
    const departmentRepo = dataSource.getRepository(DepartmentEntity);

    const userEntries = await Promise.all(
      userData.map(async (item) => {
        const userEntry = new UserEntity();
        userEntry.name = item.name;
        userEntry.lastname = item.lastname;
        userEntry.email = item.email;
        userEntry.passwordHash = await bcryptHash(item.passwordHash, 12);
        userEntry.avatar = item.avatar;
        userEntry.validFrom = new Date(item.validFrom);
        userEntry.validTo = item.validTo ? new Date(item.validTo) : null;
        userEntry.createdAt = new Date(item.createdAt);

        // Buscar los roles en RoleEntity[]
        const roles = await roleRepo.findBy({
          name: In(item.roles as RoleEntity['name'][]), // Busca todos los roles en una sola consulta con In
        });

        userEntry.roles = roles; // Asigna las entidades de roles

        // Guarda el usuario antes de crear el profesor
        const savedUser = await userRepo.save(userEntry);

        // Si el usuario tiene información de profesor, crear TeacherEntity
        if (item.teacher) {
          const department = await departmentRepo.findOneBy({ departmentId: item.teacher.department_id });
          if (!department) {
            throw new Error(`Department with ID ${item.teacher.department_id} not found`);
          }

          const teacherEntry = new TeacherEntity();
          teacherEntry.user = savedUser; // Relacionar el profesor con el usuario
          teacherEntry.department = department;
          await teacherRepo.save(teacherEntry); // Guardar el profesor
        }

        return userEntry;
      }),
    );

    console.log('Seeding users...');
    await userRepo.save(userEntries);
    console.log('Users seeding completed!');
  }
}