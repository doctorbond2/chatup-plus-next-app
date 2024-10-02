import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { RegisterInformation } from '@/models/types/Auth';
import { ValidationMessages } from '@/models/enums/errorMessages';
import { NextRequest } from 'next/server';
import { User_JWT } from '@/models/types/Auth';
import PrismaKit from '@/models/classes/prisma';
const SECRET_KEY = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;
export const generateToken = async <T extends User_JWT>(payload: T) => {
  return jwt.sign(payload, SECRET_KEY as string, {
    expiresIn: '1d',
  });
};
export const generateRefreshToken = async <T extends User_JWT>(payload: T) => {
  return jwt.sign(payload, REFRESH_SECRET_KEY as string, {
    expiresIn: '1d',
  });
};
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const verifyToken = async (req: NextRequest) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY as string);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY as string);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export const veryifyRegisterInformation = async ({
  username,
  lastName,
  firstName,
  password,
  email,
}: RegisterInformation): Promise<string[]> => {
  const {
    USERNAME_REQUIRED,
    USERNAME_TOO_SHORT,
    LAST_NAME_REQUIRED,
    FIRST_NAME_REQUIRED,
    PASSWORD_REQUIRED,
    EMAIL_REQUIRED,
    INVALID_USERNAME_NOT_AVAILABLE,
    INVALID_EMAIL_NOT_AVAILABLE,
  } = ValidationMessages;
  const errors: string[] = [];
  if (!username) {
    errors.push(USERNAME_REQUIRED);
  } else if (username.length < 4) {
    errors.push(USERNAME_TOO_SHORT);
  }
  if (!lastName) {
    errors.push(LAST_NAME_REQUIRED);
  }
  if (!firstName) {
    errors.push(FIRST_NAME_REQUIRED);
  }
  if (!password) {
    errors.push(PASSWORD_REQUIRED);
  }
  if (!email) {
    errors.push(EMAIL_REQUIRED);
  }
  const usernameAvailable = await PrismaKit.checkUsernameAvailability(username);
  if (!usernameAvailable) {
    errors.push(INVALID_USERNAME_NOT_AVAILABLE);
  }
  const emailAvailable = await PrismaKit.checkEmailAvailability(email);
  if (!emailAvailable) {
    errors.push(INVALID_EMAIL_NOT_AVAILABLE);
  }
  return errors;
};
