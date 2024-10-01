import { NextRequest } from 'next/server';
import { refreshTokens } from '@/utils/handlers/Auth/post';
export async function POST(request: NextRequest) {
  return await refreshTokens(request);
}
