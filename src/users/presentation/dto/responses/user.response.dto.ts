export class UserResponse {
  userId!: string;
  name!: string;
  lastname!: string;
  email!: string;
  avatar!: string | null;
  validFrom!: Date;
  validTo!: Date | null;
  createdAt!: Date;
}
