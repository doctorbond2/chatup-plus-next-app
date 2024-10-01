import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { User } from '@prisma/client';
import { RegisterInformation } from '@/models/types/Auth';
import { UserFrontend } from '@/models/types/User';
import { ValidationMessages as M } from '@/models/enums/errorMessages';
import { comparePassword } from '@/utils/helpers/auth';
import { veryifyRegisterInformation } from '@/utils/helpers/auth';
import { verifyRefreshToken } from '@/utils/helpers/auth';
import prisma from '@/lib/prisma';
import { generateToken, generateRefreshToken } from '@/utils/helpers/auth';
import LOCAL_STORAGE from '@/models/classes/localStorage';
import { hashPassword } from '@/utils/helpers/auth';
import PrismaKit from '@/models/classes/prisma';
export const LoginUser = async (req: NextRequest) => {
  const body: User = await req.json();
  if (!body.password || !body.username) {
    return ResponseError.default.badRequest();
  }

  if (body.email === '' || body.password === '') {
    return ResponseError.custom.badRequest(M.INVALID_PASSWORD_OR_EMAIL);
  }

  if (body.username === '' || body.password === '') {
    return ResponseError.custom.badRequest(M.INVALID_PASSWORD_OR_USERNAME);
  }

  if (body.username.length < 0) {
    return ResponseError.custom.badRequest(M.INVALID_USERNAME);
  }
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (!user) {
      return ResponseError.custom.unauthorized('Invalid Username or Password');
    }
    console.log(user, 'user', body.password, 'body.password');
    const isValidPassword = await comparePassword(body.password, user.password);
    if (!isValidPassword) {
      return ResponseError.custom.unauthorized(M.INVALID_PASSWORD_OR_USERNAME);
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

    return NextResponse.json(
      {
        data: {
          user: userFrontend,
          token,
          refreshToken,
        },
        message: 'You are logged in.',
      },
      { status: 200 }
    );
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
    const isUsernameAvailable = await PrismaKit.checkUsernameAvailability(
      body.username
    );
    const isEmailAvailable = await PrismaKit.checkEmailAvailability(body.email);
    if (!isUsernameAvailable || !isEmailAvailable) {
      return ResponseError.custom.badRequest(M.INVALID_USERNAME_NOT_AVAILABLE);
    }
    const hashedPassword = await hashPassword(body.password);
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
    const refreshToken = await generateToken(user);

    return NextResponse.json(
      {
        data: {
          user: {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            admin: user.admin ? true : false,
          },
          token,
          refreshToken,
        },
      },
      { status: 201 }
    );
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
    const decodedUser = verifyRefreshToken(refreshToken);
    if (!decodedUser) {
      return ResponseError.custom.unauthorized('Invalid refresh token');
    }
    const token = await generateToken(decodedUser);
    const newRefreshToken = await generateRefreshToken(decodedUser);

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
