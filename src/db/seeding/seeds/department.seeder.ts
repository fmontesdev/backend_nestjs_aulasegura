import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import departmentData from '../../../data/department';
import { DepartmentEntity } from '../../../entities/department.entity';

export class DepartmentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const departmentRepo = dataSource.getRepository(DepartmentEntity);

    const departmentEntries = await Promise.all(
      departmentData.map(async (item) => {
        const departmentEntry = new DepartmentEntity();
        departmentEntry.name = item.name;

        return departmentEntry;
      }),
    );

    console.log('Seeding departments...');
    await departmentRepo.save(departmentEntries);
    console.log('Departments seeding completed!');
  }
}