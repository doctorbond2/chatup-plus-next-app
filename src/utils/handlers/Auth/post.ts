import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { User } from '@prisma/client';
import { RegisterInformation } from '@/models/types/Auth';
import { UserFrontend } from '@/models/types/User';
import { ValidationMessages as M } from '@/models/enums/errorMessages';
import { comparePassword } from '@/utils/helpers/auth';
import { veryifyRegisterInformation } from '@/utils/helpers/auth';
import { verifyToken, verifyRefreshToken } from '@/utils/helpers/auth';
import prisma from '@/lib/prisma';
import { generateToken, generateRefreshToken } from '@/utils/helpers/auth';
import LOCAL_STORAGE from '@/models/classes/localStorage';
import { JwtPayload } from 'jsonwebtoken';
export const LoginUser = async (req: NextRequest) => {
  const body: User = await req.json();
  if (!body) {
    return ResponseError.default.badRequest();
  }
  if (body.email === '' || body.password === '') {
    return ResponseError.custom.badRequest(M.INVALID_PASSWORD_OR_EMAIL);
  }
  if (body.username === '' || body.password === '') {
    return ResponseError.custom.badRequest(M.INVALID_PASSWORD_OR_USERNAME);
  }
  try {
    if (body.username.length > 0) {
      const user: User | null = await prisma.user.findUnique({
        where: { username: body.username },
      });
      if (!user) {
        return ResponseError.custom.unauthorized(
          'Invalid Username or Password'
        );
      }
      const isValidPassword = await comparePassword(
        body.password,
        user.password
      );
      if (!isValidPassword) {
        return ResponseError.custom.unauthorized(
          M.INVALID_PASSWORD_OR_USERNAME
        );
      }
      const token = await generateToken(user);
      const refreshToken = await generateRefreshToken(user);
      LOCAL_STORAGE.token.set(token);
      LOCAL_STORAGE.refreshToken.set(refreshToken);
      const userFrontend: UserFrontend = {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin ? true : false,
      };
      return NextResponse.json({
        data: userFrontend,
        message: 'You are logged in.',
        status: 200,
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError;
  }
};
export const registerUser = async (req: NextRequest) => {
  const body: RegisterInformation = await req.json();
  if (!body) {
    return ResponseError.default.badRequest();
  }
  const errors = veryifyRegisterInformation(body);
  if (errors.length > 0) {
    const errMessage = errors.join(', ');
    return ResponseError.custom.badRequest(errMessage);
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
    const token = await generateToken(user);
    const refreshToken = await generateToken(user);
    LOCAL_STORAGE.token.set(token);
    LOCAL_STORAGE.refreshToken.set(refreshToken);

    return NextResponse.json({ status: 201 });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
const refreshTokens = async (req: NextRequest) => {
  const refreshToken = LOCAL_STORAGE.refreshToken.get();
  if (!refreshToken) {
    return ResponseError.custom.unauthorized('No refresh token found');
  }
  try {
    const decodedId = verifyRefreshToken(refreshToken);
    if (!decodedId) {
      return ResponseError.custom.unauthorized('Invalid refresh token');
    }
    const user = await prisma.user.findUnique({ where: { id: decodedId } });
    if (!user) {
      return ResponseError.custom.unauthorized('User not found');
    }
    const token = await generateToken(user);
    const newRefreshToken = await generateRefreshToken(user);
    LOCAL_STORAGE.token.set(token);
    LOCAL_STORAGE.refreshToken.set(newRefreshToken);
    return NextResponse.json({ status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
