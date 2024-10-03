import { NextRequest } from 'next/server';
import { LoginUser } from '@/utils/handlers/Auth/post';

export async function POST(request: NextRequest): Promise<Response> {
  return await LoginUser(request);
}
