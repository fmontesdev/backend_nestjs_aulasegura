import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RoleEntity, RoleName } from '../../../users/domain/entities/role.entity';

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(RoleEntity);

    // Itera sobre los valores del enum RoleName
    for (const roleName of Object.values(RoleName)) {
      // Verifica si el rol ya existe
      const existingRole = await roleRepo.findOneBy({ name: roleName });
      if (!existingRole) {
        const roleEntry = new RoleEntity();
        roleEntry.name = roleName;
        console.log('Seeding roles...');
        await roleRepo.save(roleEntry);
        console.log(`Role ${roleName} added.`);
      } else {
        console.log(`Role ${roleName} already exists. Skipping...`);
      }
    }
  }
}