import ResponseError from '@/models/classes/responseError';
import { middleware_authenticate_request } from '@/utils/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/utils/handlers/User/put';
export async function PUT(req: NextRequest): Promise<Response> {
  return await updateUser(req);
}
