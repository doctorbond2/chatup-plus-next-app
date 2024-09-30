import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { RegisterInformation } from '@/models/types/Auth';
import { ValidationMessages } from '@/models/enums/errorMessages';
const SECRET_KEY = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;
export const generateToken = async <
  T extends { username: string; id: string; admin?: boolean }
>(
  payload: T
) => {
  return jwt.sign(payload, SECRET_KEY as string, {
    expiresIn: '1d',
  });
};
export const generateRefreshToken = async <
  T extends { username: string; id: string; admin?: boolean }
>(
  payload: T
) => {
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

export const verifyToken = async (token: string) => {
  return jwt.verify(token, SECRET_KEY as string);
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY as string);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export const veryifyRegisterInformation = ({
  username,
  lastName,
  firstName,
  password,
  email,
}: RegisterInformation): string[] => {
  const {
    USERNAME_REQUIRED,
    USERNAME_TOO_SHORT,
    LAST_NAME_REQUIRED,
    FIRST_NAME_REQUIRED,
    PASSWORD_REQUIRED,
    EMAIL_REQUIRED,
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
  return errors;
};
