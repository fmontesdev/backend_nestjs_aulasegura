import { DataSource } from 'typeorm';
import { RoleEntity } from '../../../users/domain/entities/role.entity';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

export const seedRoles = async (dataSource: DataSource): Promise<void> => {
  const roleRepo = dataSource.getRepository(RoleEntity);

  const roles = [
    { roleId: 1, name: RoleName.ADMIN },
    { roleId: 2, name: RoleName.TEACHER },
    { roleId: 3, name: RoleName.JANITOR },
    { roleId: 4, name: RoleName.SUPPORT_STAFF },
  ];

  for (const data of roles) {
    const exists = await roleRepo.findOne({ where: { roleId: data.roleId } });
    if (!exists) {
      const role = roleRepo.create(data);
      await roleRepo.save(role);
      console.log(`Role created: ${data.name}`);
    } else {
      console.log(`Role already exists: ${data.name}`);
    }
  }
};
