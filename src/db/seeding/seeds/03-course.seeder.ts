import { DataSource } from 'typeorm';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { EducationStage } from '../../../courses/domain/enums/education-stage.enum';
import { CFLevel } from '../../../courses/domain/enums/cf-level.enum';

export const seedCourses = async (dataSource: DataSource): Promise<void> => {
  const courseRepo = dataSource.getRepository(CourseEntity);

  const courses = [
    { courseId: 1, courseCode: 'ESO1', name: '1º ESO', isActive: true, educationStage: EducationStage.ESO, levelNumber: 1, cfLevel: null },
    { courseId: 2, courseCode: 'ESO2', name: '2º ESO', isActive: true, educationStage: EducationStage.ESO, levelNumber: 2, cfLevel: null },
    { courseId: 3, courseCode: 'ESO3', name: '3º ESO', isActive: true, educationStage: EducationStage.ESO, levelNumber: 3, cfLevel: null },
    { courseId: 4, courseCode: 'ESO4', name: '4º ESO', isActive: true, educationStage: EducationStage.ESO, levelNumber: 4, cfLevel: null },
    { courseId: 5, courseCode: 'BACH1', name: '1º Bachillerato', isActive: true, educationStage: EducationStage.BACHILLERATO, levelNumber: 1, cfLevel: null },
    { courseId: 6, courseCode: 'BACH2', name: '2º Bachillerato', isActive: true, educationStage: EducationStage.BACHILLERATO, levelNumber: 2, cfLevel: null },
    { courseId: 7, courseCode: 'CFGM-SMR-1', name: '1º Sistemas Microinformáticos y Redes', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGM },
    { courseId: 8, courseCode: 'CFGM-SMR-2', name: '2º Sistemas Microinformáticos y Redes', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGM },
    { courseId: 9, courseCode: 'CFGS-DAW-1', name: '1º Desarrollo de Aplicaciones Web', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGS },
    { courseId: 10, courseCode: 'CFGS-DAW-2', name: '2º Desarrollo de Aplicaciones Web', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGS },
    { courseId: 11, courseCode: 'CFGS-DAM-1', name: '1º Desarrollo de Aplicaciones Multiplataforma', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGS },
    { courseId: 12, courseCode: 'CFGS-DAM-2', name: '2º Desarrollo de Aplicaciones Multiplataforma', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGS },
    { courseId: 13, courseCode: 'CFGM-AC-1', name: '1º Actividades Comerciales', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGM },
    { courseId: 14, courseCode: 'CFGM-AC-2', name: '2º Actividades Comerciales', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGM },
    { courseId: 15, courseCode: 'CFGS-CI-1', name: '1º Comercio Internacional', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGS },
    { courseId: 16, courseCode: 'CFGS-CI-2', name: '2º Comercio Internacional', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGS },
    { courseId: 17, courseCode: 'CFGS-TL-1', name: '1º Transporte y Logística', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGS },
    { courseId: 18, courseCode: 'CFGS-TL-2', name: '2º Transporte y Logística', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGS },
    { courseId: 19, courseCode: 'FPB-SA-1', name: '1º Servicios Administrativos', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.FPB },
    { courseId: 20, courseCode: 'FPB-SA-2', name: '2º Servicios Administrativos', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.FPB },
    { courseId: 21, courseCode: 'CFGM-GA-1', name: '1º Gestión Administrativa', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGM },
    { courseId: 22, courseCode: 'CFGM-GA-2', name: '2º Gestión Administrativa', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGM },
    { courseId: 23, courseCode: 'CFGS-AF-1', name: '1º Administración y Finanzas', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGS },
    { courseId: 24, courseCode: 'CFGS-AF-2', name: '2º Administración y Finanzas', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGS },
    { courseId: 26, courseCode: 'CFGS-ASIR-1', name: '1º Administración de Sistemas Informáticos en Red', isActive: true, educationStage: EducationStage.CF, levelNumber: 1, cfLevel: CFLevel.CFGS },
    { courseId: 27, courseCode: 'CFGS-ASIR-2', name: '2º Administración de Sistemas Informáticos en Red', isActive: true, educationStage: EducationStage.CF, levelNumber: 2, cfLevel: CFLevel.CFGS },
    { courseId: 28, courseCode: 'cur-02', name: 'Curso 2', isActive: false, educationStage: EducationStage.BACHILLERATO, levelNumber: 2, cfLevel: null },
    { courseId: 29, courseCode: 'cur-01', name: 'Curso 1', isActive: false, educationStage: EducationStage.BACHILLERATO, levelNumber: 1, cfLevel: null },
  ];

  for (const data of courses) {
    const exists = await courseRepo.findOne({ where: { courseId: data.courseId } });
    if (!exists) {
      const course = courseRepo.create(data);
      await courseRepo.save(course);
      console.log(`Course created: ${data.name}`);
    } else {
      console.log(`Course already exists: ${data.name}`);
    }
  }
};
