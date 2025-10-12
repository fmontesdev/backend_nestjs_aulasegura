import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RoleEntity } from '../../../users/domain/entities/role.entity';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(RoleEntity);

    // Itera sobre los valores del enum RoleName
    console.log('Seeding roles...');
    for (const roleName of Object.values(RoleName)) {
      // Verifica si el rol ya existe
      const existingRole = await roleRepo.findOneBy({ name: roleName });
      if (!existingRole) {
        const roleEntry = new RoleEntity();
        roleEntry.name = roleName;
        await roleRepo.save(roleEntry);
        console.log(`Role ${roleName} added.`);
      } else {
        console.log(`Role ${roleName} already exists. Skipping...`);
      }
    }
    console.log('Roles seeding completed!');
  }
}