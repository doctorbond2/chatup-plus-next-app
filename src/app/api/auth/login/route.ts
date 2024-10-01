import { LoginUser } from '@/utils/handlers/Auth/post';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
  return await LoginUser(request);
}
