import prisma from '@/lib/prisma';
import ResponseError from '@/models/classes/responseError';
import { ValidationMessages as M } from '@/models/enums/errorMessages';
import { RegisterInformation } from '@/models/types/Auth';
import { UserFrontend } from '@/models/types/User';
import { hashPassword } from '@/utils/helpers/auth';
import { User_JWT } from '@/models/types/Auth';
import {
  comparePassword,
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
  veryifyRegisterInformation,
} from '@/utils/helpers/auth';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
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
      const userFrontend: UserFrontend = {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin ? true : false,
      };
      return NextResponse.json({
        data: {
          user: userFrontend,
          token,
          refreshToken,
        },
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
  const errors = await veryifyRegisterInformation(body);
  if (errors.length > 0) {
    const errMessage = errors.join(', ');
    return ResponseError.custom.badRequest(errMessage);
  }
  const hashedPassword = await hashPassword(body.password);
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);

    const userFrontend: UserFrontend = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin ? true : false,
    };
    return NextResponse.json({
      data: {
        user: userFrontend,
        token,
        refreshToken,
      },
      message: 'You are registered.',
      status: 201,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
export const refreshTokens = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.refreshToken) {
    return ResponseError.custom.unauthorized('No refresh token found');
  }

  const { refreshToken } = body;

  try {
    const decodedUser = verifyRefreshToken(refreshToken);
    if (!decodedUser) {
      return ResponseError.custom.unauthorized('Invalid refresh token');
    }

    const token: string = await generateToken(decodedUser as User_JWT);

    const newRefreshToken: string = await generateRefreshToken(
      decodedUser as User_JWT
    );

    return NextResponse.json({
      data: {
        token,
        refreshToken: newRefreshToken,
      },
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(String(err));
    }
    return ResponseError.default.internalServerError();
  }
};
