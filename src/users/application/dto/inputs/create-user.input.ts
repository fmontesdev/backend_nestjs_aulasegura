export interface CreateUserInput {
  name: string;
  lastname: string;
  email: string;
  password: string;
  avatar?: string | null;
  validTo?: Date | null;
}
