import { DataSource } from 'typeorm';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';

export const seedSubjects = async (dataSource: DataSource): Promise<void> => {
  const subjectRepo = dataSource.getRepository(SubjectEntity);

  const subjects = [
    {
        "subjectId": 1,
        "subjectCode": "MAT-ESO-1",
        "name": "Matemáticas 1",
        "departmentId": 17,
        "isActive": true
    },
    {
        "subjectId": 2,
        "subjectCode": "LEN-ESO-1",
        "name": "Lengua Castellana 1",
        "departmentId": 15,
        "isActive": true
    },
    {
        "subjectId": 3,
        "subjectCode": "VAL-ESO-1",
        "name": "Valenciano 1",
        "departmentId": 16,
        "isActive": true
    },
    {
        "subjectId": 4,
        "subjectCode": "ENG-ESO-1",
        "name": "Inglés 1",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 5,
        "subjectCode": "GH-ESO-1",
        "name": "Geografía e Historia 1",
        "departmentId": 12,
        "isActive": true
    },
    {
        "subjectId": 6,
        "subjectCode": "BIO-ESO-1",
        "name": "Biología 1",
        "departmentId": 2,
        "isActive": true
    },
    {
        "subjectId": 7,
        "subjectCode": "VALE-ESO-1",
        "name": "Valores Éticos 1",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 8,
        "subjectCode": "TEC-ESO-1",
        "name": "Tecnología 1",
        "departmentId": 21,
        "isActive": true
    },
    {
        "subjectId": 9,
        "subjectCode": "EF-ESO-1",
        "name": "Educación Física 1",
        "departmentId": 4,
        "isActive": true
    },
    {
        "subjectId": 10,
        "subjectCode": "MUS-ESO-1",
        "name": "Música 1",
        "departmentId": 18,
        "isActive": true
    },
    {
        "subjectId": 11,
        "subjectCode": "DIG-ESO-1",
        "name": "Digitalización 1",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 12,
        "subjectCode": "FRA-ESO-1",
        "name": "Francés 1",
        "departmentId": 11,
        "isActive": true
    },
    {
        "subjectId": 13,
        "subjectCode": "ART-ESO-1",
        "name": "Plástica 1",
        "departmentId": 1,
        "isActive": true
    },
    {
        "subjectId": 14,
        "subjectCode": "REL-ESO-1",
        "name": "Religión 1",
        "departmentId": 20,
        "isActive": true
    },
    {
        "subjectId": 15,
        "subjectCode": "LEN-ESO-2",
        "name": "Lengua Castellana 2",
        "departmentId": 15,
        "isActive": true
    },
    {
        "subjectId": 16,
        "subjectCode": "VAL-ESO-2",
        "name": "Valenciano 2",
        "departmentId": 16,
        "isActive": true
    },
    {
        "subjectId": 17,
        "subjectCode": "ENG-ESO-2",
        "name": "Inglés 2",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 18,
        "subjectCode": "MAT-ESO-2",
        "name": "Matemáticas 2",
        "departmentId": 17,
        "isActive": true
    },
    {
        "subjectId": 19,
        "subjectCode": "GH-ESO-2",
        "name": "Geografía e Historia 2",
        "departmentId": 12,
        "isActive": true
    },
    {
        "subjectId": 20,
        "subjectCode": "FYQ-ESO-2",
        "name": "Física y Química 2",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 21,
        "subjectCode": "TEC-ESO-2",
        "name": "Tecnología 2",
        "departmentId": 21,
        "isActive": true
    },
    {
        "subjectId": 22,
        "subjectCode": "EF-ESO-2",
        "name": "Educación Física 2",
        "departmentId": 4,
        "isActive": true
    },
    {
        "subjectId": 23,
        "subjectCode": "MUS-ESO-2",
        "name": "Música 2",
        "departmentId": 18,
        "isActive": true
    },
    {
        "subjectId": 24,
        "subjectCode": "ART-ESO-2",
        "name": "Plástica 2",
        "departmentId": 1,
        "isActive": true
    },
    {
        "subjectId": 25,
        "subjectCode": "DIG-ESO-2",
        "name": "Digitalización 2",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 26,
        "subjectCode": "FRA-ESO-2",
        "name": "Francés 2",
        "departmentId": 11,
        "isActive": true
    },
    {
        "subjectId": 27,
        "subjectCode": "REL-ESO-2",
        "name": "Religión 2",
        "departmentId": 20,
        "isActive": true
    },
    {
        "subjectId": 28,
        "subjectCode": "VALE-ESO-2",
        "name": "Valores Éticos 2",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 29,
        "subjectCode": "TUT-ESO-2",
        "name": "Tutoría 2º ESO",
        "departmentId": 19,
        "isActive": true
    },
    {
        "subjectId": 30,
        "subjectCode": "LEN-ESO-3",
        "name": "Lengua Castellana 3",
        "departmentId": 15,
        "isActive": true
    },
    {
        "subjectId": 31,
        "subjectCode": "VAL-ESO-3",
        "name": "Valenciano 3",
        "departmentId": 16,
        "isActive": true
    },
    {
        "subjectId": 32,
        "subjectCode": "ENG-ESO-3",
        "name": "Inglés 3",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 33,
        "subjectCode": "MAT-ESO-3",
        "name": "Matemáticas 3",
        "departmentId": 17,
        "isActive": true
    },
    {
        "subjectId": 34,
        "subjectCode": "GH-ESO-3",
        "name": "Geografía e Historia 3",
        "departmentId": 12,
        "isActive": true
    },
    {
        "subjectId": 35,
        "subjectCode": "BIO-ESO-3",
        "name": "Biología 3",
        "departmentId": 2,
        "isActive": true
    },
    {
        "subjectId": 36,
        "subjectCode": "FYQ-ESO-3",
        "name": "Física y Química 3",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 37,
        "subjectCode": "TEC-ESO-3",
        "name": "Tecnología 3",
        "departmentId": 21,
        "isActive": true
    },
    {
        "subjectId": 38,
        "subjectCode": "EF-ESO-3",
        "name": "Educación Física 3",
        "departmentId": 4,
        "isActive": true
    },
    {
        "subjectId": 39,
        "subjectCode": "MUS-ESO-3",
        "name": "Música 3",
        "departmentId": 18,
        "isActive": true
    },
    {
        "subjectId": 40,
        "subjectCode": "ART-ESO-3",
        "name": "Plástica 3",
        "departmentId": 1,
        "isActive": true
    },
    {
        "subjectId": 41,
        "subjectCode": "DIG-ESO-3",
        "name": "Digitalización 3",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 42,
        "subjectCode": "FRA-ESO-3",
        "name": "Francés 3",
        "departmentId": 11,
        "isActive": true
    },
    {
        "subjectId": 43,
        "subjectCode": "REL-ESO-3",
        "name": "Religión 3",
        "departmentId": 20,
        "isActive": true
    },
    {
        "subjectId": 44,
        "subjectCode": "VALE-ESO-3",
        "name": "Valores Éticos 3",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 45,
        "subjectCode": "TUT-ESO-3",
        "name": "Tutoría 3º ESO",
        "departmentId": 19,
        "isActive": true
    },
    {
        "subjectId": 46,
        "subjectCode": "LEN-ESO-4",
        "name": "Lengua Castellana 4",
        "departmentId": 15,
        "isActive": true
    },
    {
        "subjectId": 47,
        "subjectCode": "VAL-ESO-4",
        "name": "Valenciano 4",
        "departmentId": 16,
        "isActive": true
    },
    {
        "subjectId": 48,
        "subjectCode": "ENG-ESO-4",
        "name": "Inglés 4",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 49,
        "subjectCode": "MAT-ESO-4",
        "name": "Matemáticas 4",
        "departmentId": 17,
        "isActive": true
    },
    {
        "subjectId": 50,
        "subjectCode": "GH-ESO-4",
        "name": "Geografía e Historia 4",
        "departmentId": 12,
        "isActive": true
    },
    {
        "subjectId": 51,
        "subjectCode": "BIO-ESO-4",
        "name": "Biología 4",
        "departmentId": 2,
        "isActive": true
    },
    {
        "subjectId": 52,
        "subjectCode": "FYQ-ESO-4",
        "name": "Física y Química 4",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 53,
        "subjectCode": "TEC-ESO-4",
        "name": "Tecnología 4",
        "departmentId": 21,
        "isActive": true
    },
    {
        "subjectId": 54,
        "subjectCode": "DIG-ESO-4",
        "name": "Digitalización 4",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 55,
        "subjectCode": "EF-ESO-4",
        "name": "Educación Física 4",
        "departmentId": 4,
        "isActive": true
    },
    {
        "subjectId": 56,
        "subjectCode": "MUS-ESO-4",
        "name": "Música 4",
        "departmentId": 18,
        "isActive": true
    },
    {
        "subjectId": 57,
        "subjectCode": "ART-ESO-4",
        "name": "Plástica 4",
        "departmentId": 1,
        "isActive": true
    },
    {
        "subjectId": 58,
        "subjectCode": "FRA-ESO-4",
        "name": "Francés 4",
        "departmentId": 11,
        "isActive": true
    },
    {
        "subjectId": 59,
        "subjectCode": "REL-ESO-4",
        "name": "Religión 4",
        "departmentId": 20,
        "isActive": true
    },
    {
        "subjectId": 60,
        "subjectCode": "VALE-ESO-4",
        "name": "Valores Éticos 4",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 61,
        "subjectCode": "FIL-ESO-4",
        "name": "Filosofía 4",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 62,
        "subjectCode": "ECO-ESO-4",
        "name": "Economía 4",
        "departmentId": 3,
        "isActive": true
    },
    {
        "subjectId": 63,
        "subjectCode": "TUT-ESO-4",
        "name": "Tutoría 4º ESO",
        "departmentId": 19,
        "isActive": true
    },
    {
        "subjectId": 64,
        "subjectCode": "LEN-BACH-1",
        "name": "Lengua Castellana y Literatura I",
        "departmentId": 15,
        "isActive": true
    },
    {
        "subjectId": 65,
        "subjectCode": "VAL-BACH-1",
        "name": "Valenciano I",
        "departmentId": 16,
        "isActive": true
    },
    {
        "subjectId": 66,
        "subjectCode": "ENG-BACH-1",
        "name": "Inglés I",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 67,
        "subjectCode": "FIL-BACH-1",
        "name": "Filosofía 1",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 68,
        "subjectCode": "MAT-BACH-1",
        "name": "Matemáticas I",
        "departmentId": 17,
        "isActive": true
    },
    {
        "subjectId": 69,
        "subjectCode": "HMC-BACH-1",
        "name": "Historia del Mundo Contemporáneo",
        "departmentId": 12,
        "isActive": true
    },
    {
        "subjectId": 70,
        "subjectCode": "BIO-BACH-1",
        "name": "Biología I",
        "departmentId": 2,
        "isActive": true
    },
    {
        "subjectId": 71,
        "subjectCode": "FIS-BACH-1",
        "name": "Física I",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 72,
        "subjectCode": "QUI-BACH-1",
        "name": "Química I",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 73,
        "subjectCode": "ECO-BACH-1",
        "name": "Economía 1",
        "departmentId": 3,
        "isActive": true
    },
    {
        "subjectId": 74,
        "subjectCode": "LAT-BACH-1",
        "name": "Latín I",
        "departmentId": 14,
        "isActive": true
    },
    {
        "subjectId": 75,
        "subjectCode": "TIC-BACH-1",
        "name": "TIC I",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 76,
        "subjectCode": "EF-BACH-1",
        "name": "Educación Física Bach 1",
        "departmentId": 4,
        "isActive": true
    },
    {
        "subjectId": 77,
        "subjectCode": "REL-BACH-1",
        "name": "Religión Bach 1",
        "departmentId": 20,
        "isActive": true
    },
    {
        "subjectId": 78,
        "subjectCode": "VALE-BACH-1",
        "name": "Valores Éticos Bach 1",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 79,
        "subjectCode": "TUT-BACH-1",
        "name": "Tutoría 1º Bachillerato",
        "departmentId": 19,
        "isActive": true
    },
    {
        "subjectId": 80,
        "subjectCode": "LEN-BACH-2",
        "name": "Lengua Castellana y Literatura II",
        "departmentId": 15,
        "isActive": true
    },
    {
        "subjectId": 81,
        "subjectCode": "VAL-BACH-2",
        "name": "Valenciano II",
        "departmentId": 16,
        "isActive": true
    },
    {
        "subjectId": 82,
        "subjectCode": "ENG-BACH-2",
        "name": "Inglés II",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 83,
        "subjectCode": "FIL-BACH-2",
        "name": "Historia de la Filosofía",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 84,
        "subjectCode": "MAT-BACH-2",
        "name": "Matemáticas II",
        "departmentId": 17,
        "isActive": true
    },
    {
        "subjectId": 85,
        "subjectCode": "HESP-BACH-2",
        "name": "Historia de España 2",
        "departmentId": 12,
        "isActive": true
    },
    {
        "subjectId": 86,
        "subjectCode": "BIO-BACH-2",
        "name": "Biología II",
        "departmentId": 2,
        "isActive": true
    },
    {
        "subjectId": 87,
        "subjectCode": "FIS-BACH-2",
        "name": "Física II",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 88,
        "subjectCode": "QUI-BACH-2",
        "name": "Química II",
        "departmentId": 9,
        "isActive": true
    },
    {
        "subjectId": 89,
        "subjectCode": "ECO-BACH-2",
        "name": "Economía de la Empresa",
        "departmentId": 3,
        "isActive": true
    },
    {
        "subjectId": 90,
        "subjectCode": "LAT-BACH-2",
        "name": "Latín II",
        "departmentId": 14,
        "isActive": true
    },
    {
        "subjectId": 91,
        "subjectCode": "TIC-BACH-2",
        "name": "TIC II",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 92,
        "subjectCode": "CTM-BACH-2",
        "name": "Ciencias de la Tierra y Medioambientales",
        "departmentId": 2,
        "isActive": true
    },
    {
        "subjectId": 93,
        "subjectCode": "REL-BACH-2",
        "name": "Religión Bach 2",
        "departmentId": 20,
        "isActive": true
    },
    {
        "subjectId": 94,
        "subjectCode": "VALE-BACH-2",
        "name": "Valores Éticos Bach 2",
        "departmentId": 8,
        "isActive": true
    },
    {
        "subjectId": 95,
        "subjectCode": "TUT-BACH-2",
        "name": "Tutoría 2º Bachillerato",
        "departmentId": 19,
        "isActive": true
    },
    {
        "subjectId": 96,
        "subjectCode": "FOL-CF",
        "name": "Formación y Orientación Laboral",
        "departmentId": 10,
        "isActive": true
    },
    {
        "subjectId": 97,
        "subjectCode": "EIE-CF",
        "name": "Empresa e Iniciativa Emprendedora",
        "departmentId": 10,
        "isActive": true
    },
    {
        "subjectId": 98,
        "subjectCode": "MME-SMR",
        "name": "Montaje y mantenimiento de equipos",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 99,
        "subjectCode": "SOM-SMR",
        "name": "Sistemas operativos monopuesto",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 100,
        "subjectCode": "AO-SMR",
        "name": "Aplicaciones ofimáticas",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 101,
        "subjectCode": "RL-SMR",
        "name": "Redes locales",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 102,
        "subjectCode": "SOR-SMR",
        "name": "Sistemas operativos en red",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 103,
        "subjectCode": "SR-SMR",
        "name": "Servicios en red",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 104,
        "subjectCode": "SEG-SMR",
        "name": "Seguridad informática",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 105,
        "subjectCode": "AW-SMR",
        "name": "Aplicaciones web",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 106,
        "subjectCode": "PROG-CF",
        "name": "Programación",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 107,
        "subjectCode": "BD-CF",
        "name": "Bases de Datos",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 108,
        "subjectCode": "SI-CF",
        "name": "Sistemas Informáticos",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 109,
        "subjectCode": "LM-CF",
        "name": "Lenguajes de Marcas y Sistemas de Gestión de Información",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 110,
        "subjectCode": "ED-CF",
        "name": "Entornos de Desarrollo",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 111,
        "subjectCode": "PROY-DAW",
        "name": "Proyecto de Desarrollo de Aplicaciones Web",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 112,
        "subjectCode": "DWEC-DAW",
        "name": "Desarrollo Web en Entorno Cliente",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 113,
        "subjectCode": "DWES-DAW",
        "name": "Desarrollo Web en Entorno Servidor",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 114,
        "subjectCode": "DIW-DAW",
        "name": "Diseño de Interfaces Web",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 115,
        "subjectCode": "DEP-DAW",
        "name": "Despliegue de Aplicaciones Web",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 116,
        "subjectCode": "FCT-DAW",
        "name": "Formación en Centros de Trabajo (DAW)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 117,
        "subjectCode": "AD-DAM",
        "name": "Acceso a Datos (DAM)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 118,
        "subjectCode": "DI-DAM",
        "name": "Desarrollo de Interfaces (DAM)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 119,
        "subjectCode": "PMDM-DAM",
        "name": "Programación multimedia y de dispositivos móviles (DAM)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 120,
        "subjectCode": "PSP-DAM",
        "name": "Programación de servicios y procesos (DAM)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 121,
        "subjectCode": "SGE-DAM",
        "name": "Sistemas de gestión empresarial (DAM)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 122,
        "subjectCode": "PROY-DAM",
        "name": "Proyecto de Desarrollo de Aplicaciones Multiplataforma",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 123,
        "subjectCode": "FCT-DAM",
        "name": "Formación en Centros de Trabajo (DAM)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 124,
        "subjectCode": "MK-AC",
        "name": "Marketing en la actividad comercial",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 125,
        "subjectCode": "GCOM-AC",
        "name": "Gestión de compras",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 126,
        "subjectCode": "TALM-AC",
        "name": "Técnicas de almacén",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 127,
        "subjectCode": "PV-AC",
        "name": "Procesos de venta",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 128,
        "subjectCode": "SAC-AC",
        "name": "Servicios de atención al cliente",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 129,
        "subjectCode": "AIC-AC",
        "name": "Aplicaciones informáticas para el comercio",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 130,
        "subjectCode": "PROY-AC",
        "name": "Proyecto de Actividades Comerciales",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 131,
        "subjectCode": "FCT-AC",
        "name": "Formación en Centros de Trabajo (Actividades Comerciales)",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 132,
        "subjectCode": "GACI-CI",
        "name": "Gestión administrativa del comercio internacional",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 133,
        "subjectCode": "TIM-CI",
        "name": "Transporte internacional de mercancías",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 134,
        "subjectCode": "LOGA-CI",
        "name": "Logística de almacenamiento",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 135,
        "subjectCode": "SIM-CI",
        "name": "Sistema de información de mercados",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 136,
        "subjectCode": "MKI-CI",
        "name": "Marketing internacional",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 137,
        "subjectCode": "NEG-CI",
        "name": "Negociación internacional",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 138,
        "subjectCode": "FINT-CI",
        "name": "Financiación internacional",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 139,
        "subjectCode": "MPINT-CI",
        "name": "Medios de pago internacionales",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 140,
        "subjectCode": "ECOD-CI",
        "name": "Comercio digital internacional",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 141,
        "subjectCode": "PROY-CI",
        "name": "Proyecto de Comercio Internacional",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 142,
        "subjectCode": "FCT-CI",
        "name": "Formación en Centros de Trabajo (Comercio Internacional)",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 143,
        "subjectCode": "GATL-TL",
        "name": "Gestión administrativa del transporte y la logística",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 144,
        "subjectCode": "TIM-TL",
        "name": "Transporte internacional de mercancías (TL)",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 145,
        "subjectCode": "LOGA-TL",
        "name": "Logística de almacenamiento (TL)",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 146,
        "subjectCode": "LOGAP-TL",
        "name": "Logística de aprovisionamiento",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 147,
        "subjectCode": "OTV-TL",
        "name": "Organización del transporte de viajeros",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 148,
        "subjectCode": "OTM-TL",
        "name": "Organización del transporte de mercancías",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 149,
        "subjectCode": "COM-TL",
        "name": "Comercialización del transporte y la logística",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 150,
        "subjectCode": "GEF-TL",
        "name": "Gestión económica y financiera del transporte",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 151,
        "subjectCode": "ENG-TL",
        "name": "Inglés aplicado a transporte y logística",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 152,
        "subjectCode": "PROY-TL",
        "name": "Proyecto de Transporte y Logística",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 153,
        "subjectCode": "FCT-TL",
        "name": "Formación en Centros de Trabajo (Transporte y Logística)",
        "departmentId": 6,
        "isActive": true
    },
    {
        "subjectId": 154,
        "subjectCode": "TAD-FPB",
        "name": "Tratamiento informático de datos",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 155,
        "subjectCode": "TAB-FPB",
        "name": "Técnicas administrativas básicas",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 156,
        "subjectCode": "ACO-FPB",
        "name": "Archivo y comunicación",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 157,
        "subjectCode": "ATC-FPB",
        "name": "Atención al cliente (FPB)",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 158,
        "subjectCode": "OFI-FPB",
        "name": "Aplicaciones básicas de ofimática",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 159,
        "subjectCode": "VTA-FPB",
        "name": "Venta y servicio al cliente",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 160,
        "subjectCode": "PROY-FPB",
        "name": "Proyecto de Servicios Administrativos",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 161,
        "subjectCode": "FCT-FPB",
        "name": "Formación en Centros de Trabajo (Servicios Administrativos)",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 162,
        "subjectCode": "OCOM-GA",
        "name": "Operaciones administrativas de compraventa",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 163,
        "subjectCode": "ORRHH-GA",
        "name": "Operaciones administrativas de recursos humanos",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 164,
        "subjectCode": "TDC-GA",
        "name": "Tratamiento de la documentación contable",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 165,
        "subjectCode": "TECC-GA",
        "name": "Técnica contable",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 166,
        "subjectCode": "EA-GA",
        "name": "Empresa y administración",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 167,
        "subjectCode": "CEAC-GA",
        "name": "Comunicación empresarial y atención al cliente",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 168,
        "subjectCode": "AIG-GA",
        "name": "Aplicaciones informáticas de gestión",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 169,
        "subjectCode": "PROY-GA",
        "name": "Proyecto de Gestión Administrativa",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 170,
        "subjectCode": "FCT-GA",
        "name": "Formación en Centros de Trabajo (Gestión Administrativa)",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 171,
        "subjectCode": "CA-AF",
        "name": "Comunicación y atención al cliente",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 172,
        "subjectCode": "GDJE-AF",
        "name": "Gestión de la documentación jurídica y empresarial",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 173,
        "subjectCode": "PIA-AF",
        "name": "Proceso integral de la actividad comercial",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 174,
        "subjectCode": "OFI-AF",
        "name": "Ofimática y proceso de la información",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 175,
        "subjectCode": "RRHH-AF",
        "name": "Recursos humanos y responsabilidad social corporativa",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 176,
        "subjectCode": "GFI-AF",
        "name": "Gestión financiera",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 177,
        "subjectCode": "CONTFIS-AF",
        "name": "Contabilidad y fiscalidad",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 178,
        "subjectCode": "GLC-AF",
        "name": "Gestión logística y comercial",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 179,
        "subjectCode": "SIM-AF",
        "name": "Simulación empresarial",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 180,
        "subjectCode": "PROY-AF",
        "name": "Proyecto de Administración y Finanzas",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 181,
        "subjectCode": "FCT-AF",
        "name": "Formación en Centros de Trabajo (Administración y Finanzas)",
        "departmentId": 5,
        "isActive": true
    },
    {
        "subjectId": 182,
        "subjectCode": "SO-ASIR",
        "name": "Implantación de sistemas operativos",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 183,
        "subjectCode": "RED-ASIR",
        "name": "Planificación y administración de redes",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 184,
        "subjectCode": "HW-ASIR",
        "name": "Fundamentos de hardware",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 185,
        "subjectCode": "GBD-ASIR",
        "name": "Gestión de bases de datos (ASIR)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 186,
        "subjectCode": "ASO-ASIR",
        "name": "Administración de sistemas operativos",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 187,
        "subjectCode": "SRED-ASIR",
        "name": "Servicios de red",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 188,
        "subjectCode": "SEG-ASIR",
        "name": "Seguridad y alta disponibilidad",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 189,
        "subjectCode": "IAW-ASIR",
        "name": "Implantación de aplicaciones web",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 190,
        "subjectCode": "SGBD-ASIR",
        "name": "Administración de sistemas gestores de bases de datos",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 191,
        "subjectCode": "ENG-ASIR",
        "name": "Inglés técnico para informática",
        "departmentId": 13,
        "isActive": true
    },
    {
        "subjectId": 192,
        "subjectCode": "PROY-ASIR",
        "name": "Proyecto de Administración de Sistemas Informáticos en Red",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 193,
        "subjectCode": "FCT-ASIR",
        "name": "Formación en Centros de Trabajo (ASIR)",
        "departmentId": 7,
        "isActive": true
    },
    {
        "subjectId": 194,
        "subjectCode": "NUEVA",
        "name": "nueva",
        "departmentId": 1,
        "isActive": false
    }
];

  for (const data of subjects) {
    const exists = await subjectRepo.findOne({ where: { subjectId: data.subjectId } });
    if (!exists) {
      const subject = subjectRepo.create(data);
      await subjectRepo.save(subject);
      console.log(`Subject created: ${data.name}`);
    } else {
      console.log(`Subject already exists: ${data.name}`);
    }
  }

  console.log(`Total subjects processed: ${subjects.length}`);
};
