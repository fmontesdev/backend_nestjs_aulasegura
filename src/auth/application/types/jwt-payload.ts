export interface JwtPayload {
  sub: string; // userId
  email: string;
  roles: string[];
  tokenVersion: number;
}