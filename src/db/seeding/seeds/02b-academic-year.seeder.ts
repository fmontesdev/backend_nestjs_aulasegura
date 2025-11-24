import { DataSource } from 'typeorm';
import { AcademicYearEntity } from '../../../academic-years/domain/entities/academic-year.entity';

export const seedAcademicYears = async (dataSource: DataSource): Promise<void> => {
  const academicYearRepository = dataSource.getRepository(AcademicYearEntity);

  const academicYears = [
    { code: '2023-2024', isActive: false },
    { code: '2024-2025', isActive: false },
    { code: '2025-2026', isActive: true },
  ];

  for (const yearData of academicYears) {
    const existingYear = await academicYearRepository.findOne({ where: { code: yearData.code } });
    if (!existingYear) {
      const academicYear = academicYearRepository.create(yearData);
      await academicYearRepository.save(academicYear);
      console.log(`Academic year created: ${yearData.code}`);
    } else {
      console.log(`Academic year already exists: ${yearData.code}`);
    }
  }
};
