import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/types/User';
import { middleware_authenticate_request } from '@/utils/middleware/auth';
import ResponseError from '@/models/classes/responseError';
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const AUTH = await middleware_authenticate_request(req);
  if (AUTH.hasErrors) {
    return ResponseError.custom.unauthorized(AUTH.errors.join(', '));
  }
  return NextResponse.json({ message: 'Returned user: ' + params.id });
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const asd: number = parseInt(params.id);
  console.log(asd);
  const body: User = await req.json();

  return NextResponse.json(body, { status: 200 });
}
