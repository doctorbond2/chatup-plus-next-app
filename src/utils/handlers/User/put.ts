import ResponseError from '@/models/classes/responseError';
import { UpdateProfileInformation } from '@/models/types/Auth';
import { filterUpdateDetails } from '@/utils/helpers/filters';
import { validateUpdateProfileBody } from '@/utils/helpers/auth';
import { comparePassword } from '@/utils/helpers/password';
import prisma from '@/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';
import { DB_Updated_User } from '@/models/types/Database';
export async function updateUser(req: NextRequest): Promise<Response> {
  const body: UpdateProfileInformation = await req.json();
  const [hasError, errors] = await validateUpdateProfileBody(body);
  if (hasError) {
    return errors;
  }
  try {
    const dbRecord = await prisma.user.findUnique({
      where: { username: body.existing_username },
      select: { id: true, password: true },
    });
    if (!dbRecord) {
      return ResponseError.custom.notFound('User not found');
    }

    const validPassword = await comparePassword(
      body.existing_password,
      dbRecord.password
    );
    if (!validPassword) {
      return ResponseError.custom.forbidden('Invalid password');
    }
    const newUserData: DB_Updated_User = filterUpdateDetails(body);
    const updatedUser = await prisma.user.update({
      where: { id: dbRecord.id },
      data: newUserData,
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.log('catch');
    return ResponseError.default.internalServerError();
  }
}
