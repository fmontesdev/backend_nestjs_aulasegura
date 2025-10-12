export default [
  {
    name: "Ana",
    lastname: "Dirección",
    email: "admin@ies.es",
    passwordHash: "admin",
    avatar: null,
    validFrom: "2025-10-05T03:33:04.000Z",
    validTo: null,
    createdAt: "2025-10-05T03:33:04.000Z",
    roles: ['admin'],
    teacher: null,
  },
  {
    name: "Luis",
    lastname: "Profe",
    email: "teacher@ies.es",
    passwordHash: "teacher",
    avatar: null,
    validFrom: "2025-10-05T03:33:04.000Z",
    validTo: null,
    createdAt: "2025-10-05T03:33:04.000Z",
    roles: ['teacher'],
    teacher: {
      department_id: 1
    }
  },
  {
    name: "Marta",
    lastname: "Conserje",
    email: "janitor@ies.es",
    passwordHash: "janitor",
    avatar: null,
    validFrom: "2025-10-05T03:33:04.000Z",
    validTo: null,
    createdAt: "2025-10-05T03:33:04.000Z",
    roles: ['janitor'],
    teacher: null
  },
  {
    name: "Eva",
    lastname: "PAS",
    email: "staff@ies.es",
    passwordHash: "staff",
    avatar: null,
    validFrom: "2025-10-05T03:33:04.000Z",
    validTo: null,
    createdAt: "2025-10-05T03:33:04.000Z",
    roles: ['support_staff'],
    teacher: null
  },
];

