import { NextRequest } from 'next/server';
import { LoginUser } from '@/utils/handlers/Auth/post';

export async function POST(request: NextRequest) {
  return await loginUser(request);
}
