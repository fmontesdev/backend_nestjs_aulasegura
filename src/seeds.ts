import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './users/domain/entities/user.entity';
import { TeacherEntity } from './users/domain/entities/teacher.entity';
import { RoleEntity } from './users/domain/entities/role.entity';
import { BlacklistTokenEntity } from './auth/domain/entities/blacklist-token.entity';
import { PasswordResetTokenEntity } from './auth/domain/entities/password-reset-token.entity';
import { TagEntity } from './tags/domain/entities/tag.entity';
import { NotificationEntity } from './entities/notification.entity';
import { PermissionEntity } from './permissions/domain/entities/permission.entity';
import { AccessLogEntity } from './access/domain/entities/access-log.entity';
import { RoomEntity } from './rooms/domain/entities/room.entity';
import { ScheduleEntity } from './schedules/domain/entities/schedule.entity';
import { EventScheduleEntity } from './schedules/domain/entities/event-schedule.entity';
import { WeeklyScheduleEntity } from './schedules/domain/entities/weekly-schedule.entity';
import { AcademicYearEntity } from './academic-years/domain/entities/academic-year.entity';
import { CourseEntity } from './courses/domain/entities/course.entity';
import { DepartmentEntity } from './departments/domain/entities/department.entity';
import { SubjectEntity } from './subjects/domain/entities/subject.entity';
import { ReaderEntity } from './readers/domain/entities/reader.entity';
import { config } from 'dotenv';

// Importar seeders
import { seedRoles } from './db/seeding/seeds/01-role.seeder';
import { seedDepartments } from './db/seeding/seeds/02-department.seeder';
import { seedAcademicYears } from './db/seeding/seeds/02b-academic-year.seeder';
import { seedCourses } from './db/seeding/seeds/03-course.seeder';
import { seedUsers } from './db/seeding/seeds/04-user.seeder';
import { seedRoleUsers } from './db/seeding/seeds/05-role-user.seeder';
import { seedRooms } from './db/seeding/seeds/06-room.seeder';
import { seedAcademicYearCourse } from './db/seeding/seeds/07-academic-year-course.seeder';
import { seedSubjects } from './db/seeding/seeds/07b-subject.seeder';
import { seedCourseSubject } from './db/seeding/seeds/08-course-subject.seeder';
import { seedTeacher } from './db/seeding/seeds/09-teacher.seeder';
import { seedTeacherSubject } from './db/seeding/seeds/10-teacher-subject.seeder';
import { seedReaders } from './db/seeding/seeds/11-reader.seeder';
import { seedTags } from './db/seeding/seeds/12-tag.seeder';
import { seedSchedules } from './db/seeding/seeds/13-schedule.seeder';
import { seedWeeklySchedules } from './db/seeding/seeds/14-weekly-schedule.seeder';
import { seedEventSchedules } from './db/seeding/seeds/15-event-schedule.seeder';
import { seedPermissions } from './db/seeding/seeds/16-permission.seeder';

config();

const options: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
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
    ReaderEntity,
  ],
  synchronize: true, // Auto-create tables in development
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    console.log('Data source initialized. Running seeders...\n');
    
    // 1. Tablas base (sin dependencias)
    console.log('Seeding base tables...');
    await seedRoles(dataSource);
    await seedAcademicYears(dataSource);
    await seedDepartments(dataSource);
    await seedCourses(dataSource);
    
    // 2. Usuarios y relaciones
    console.log('\nSeeding users...');
    await seedUsers(dataSource);
    await seedRoleUsers(dataSource);
    
    // 3. Asignaturas y relaciones
    console.log('\nSeeding subjects...');
    await seedSubjects(dataSource);
    await seedCourseSubject(dataSource);
    await seedAcademicYearCourse(dataSource);
    
    // 4. Teachers y asignaciones
    console.log('\nSeeding teachers...');
    await seedTeacher(dataSource);
    await seedTeacherSubject(dataSource);
    
    // 5. Infraestructura
    console.log('\nSeeding infrastructure...');
    await seedRooms(dataSource);
    await seedReaders(dataSource);
    await seedTags(dataSource);
    
    // 6. Horarios
    console.log('\nSeeding schedules...');
    await seedSchedules(dataSource);
    await seedWeeklySchedules(dataSource);
    await seedEventSchedules(dataSource);
    
    // 7. Permisos (dependen de todo lo anterior)
    console.log('\nSeeding permissions...');
    await seedPermissions(dataSource);

    console.log('\nAll seeders executed successfully!');

    const counts = await Promise.all([
      dataSource.query('SELECT COUNT(*) as c FROM `role`'),
      dataSource.query('SELECT COUNT(*) as c FROM `academic_year`'),
      dataSource.query('SELECT COUNT(*) as c FROM `department`'),
      dataSource.query('SELECT COUNT(*) as c FROM `course`'),
      dataSource.query('SELECT COUNT(*) as c FROM `user`'),
      dataSource.query('SELECT COUNT(*) as c FROM `role_user`'),
      dataSource.query('SELECT COUNT(*) as c FROM `subject`'),
      dataSource.query('SELECT COUNT(*) as c FROM `course_subject`'),
      dataSource.query('SELECT COUNT(*) as c FROM `academic_year_course`'),
      dataSource.query('SELECT COUNT(*) as c FROM `teacher`'),
      dataSource.query('SELECT COUNT(*) as c FROM `teacher_subject`'),
      dataSource.query('SELECT COUNT(*) as c FROM `room`'),
      dataSource.query('SELECT COUNT(*) as c FROM `reader`'),
      dataSource.query('SELECT COUNT(*) as c FROM `tag`'),
      dataSource.query('SELECT COUNT(*) as c FROM `schedule`'),
      dataSource.query('SELECT COUNT(*) as c FROM `weekly_schedule`'),
      dataSource.query('SELECT COUNT(*) as c FROM `event_schedule`'),
      dataSource.query('SELECT COUNT(*) as c FROM `permission`'),
    ]);

    const [
      roles, academicYears, departments, courses, users, roleUsers,
      subjects, courseSubjects, academicYearCourses, teachers, teacherSubjects,
      rooms, readers, tags, schedules, weeklySchedules, eventSchedules, permissions,
    ] = counts.map(r => Number(r[0].c));

    console.log('\nSummary:');
    console.log(`   - ${roles} Roles`);
    console.log(`   - ${academicYears} Academic Years`);
    console.log(`   - ${departments} Departments`);
    console.log(`   - ${courses} Courses`);
    console.log(`   - ${users} Users`);
    console.log(`   - ${roleUsers} User-Role assignments`);
    console.log(`   - ${subjects} Subjects`);
    console.log(`   - ${courseSubjects} Course-Subject relations`);
    console.log(`   - ${academicYearCourses} Academic Year-Course relations`);
    console.log(`   - ${teachers} Teachers`);
    console.log(`   - ${teacherSubjects} Teacher-Subject assignments`);
    console.log(`   - ${rooms} Rooms`);
    console.log(`   - ${readers} Readers`);
    console.log(`   - ${tags} Tags`);
    console.log(`   - ${schedules} Schedules (${weeklySchedules} weekly + ${eventSchedules} events)`);
    console.log(`   - ${weeklySchedules} Weekly time slots`);
    console.log(`   - ${eventSchedules} Event schedules`);
    console.log(`   - ${permissions} Permissions`);
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing data source:', error);
    process.exit(1);
  });