import { LoginUser } from '@/utils/handlers/Auth/post';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
  console.log('Login route');
  return await LoginUser(request);
}
