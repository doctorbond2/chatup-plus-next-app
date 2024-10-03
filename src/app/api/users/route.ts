import ResponseError from '@/models/classes/responseError';
import { middleware_authenticate_request } from '@/utils/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest): Promise<Response> {
  const AUTH = await middleware_authenticate_request(req);
  if (AUTH.hasErrors) {
    return ResponseError.custom.unauthorized(AUTH.errors.join(', '));
  }

  return NextResponse.json({ message: 'Returned user:' });
}
