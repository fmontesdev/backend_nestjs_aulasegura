import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { UserEntity } from './users/domain/entities/user.entity';
import { UserSeeder } from './db/seeding/seeds/user.seeder';
import { TeacherEntity } from './users/domain/entities/teacher.entity';
import { RoleEntity } from './users/domain/entities/role.entity';
import { RoleSeeder } from './db/seeding/seeds/role.seeder';
import { BlacklistTokenEntity } from './auth/domain/entities/blacklist-token.entity';
import { PasswordResetTokenEntity } from './auth/domain/entities/password-reset-token.entity';
import { TagEntity } from './entities/tag.entity';
import { NotificationEntity } from './entities/notification.entity';
import { PermissionEntity } from './entities/permission.entity';
import { AccessLogEntity } from './entities/access-log.entity';
import { RoomEntity } from './entities/room.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { EventScheduleEntity } from './entities/event-schedule.entity';
import { WeeklyScheduleEntity } from './entities/weekly-schedule.entity';
import { AcademicYearEntity } from './academic-year/domain/entities/academic-year.entity';
import { CourseEntity } from './courses/domain/entities/course.entity';
import { DepartmentEntity } from './entities/department.entity';
import { DepartmentSeeder } from './db/seeding/seeds/department.seeder';
import { SubjectEntity } from './subjects/domain/entities/subject.entity';
import { ReaderEntity } from './entities/reader.entity';
import { config } from 'dotenv';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'db',

  entities: [
    UserEntity,
    TeacherEntity,
    RoleEntity,
    BlacklistTokenEntity,
    PasswordResetTokenEntity,
    TagEntity,
    NotificationEntity,
    PermissionEntity,
    AccessLogEntity,
    RoomEntity,
    ScheduleEntity,
    EventScheduleEntity,
    WeeklyScheduleEntity,
    AcademicYearEntity,
    CourseEntity,
    DepartmentEntity,
    SubjectEntity,
    ReaderEntity
  ],
  seeds: [
    RoleSeeder,
    DepartmentSeeder,
    UserSeeder
  ],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    console.log('Data source initialized. Running seeders...');
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
    console.log('Seeders executed successfully!');
    process.exit();
  })
  .catch((error) => console.log('Error initializing data source', error));