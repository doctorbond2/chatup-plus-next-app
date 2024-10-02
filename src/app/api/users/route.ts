import ResponseError from '@/models/classes/responseError';
import { middleware_authenticate_request } from '@/utils/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  if (!(await middleware_authenticate_request(req))) {
    ResponseError.default.unauthorized();
  }
  return NextResponse.json({ message: 'Returned user:' });
}
