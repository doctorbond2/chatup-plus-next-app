import { User as PrismaUser } from '@prisma/client';
export interface User extends PrismaUser {
  fullName?: string;
}
export interface UserFrontend
  extends Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'id'> {
  fullName?: string;
}
