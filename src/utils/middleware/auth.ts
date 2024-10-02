import { NextRequest } from 'next/server';
import { verifyToken } from '../helpers/auth';
export const middleware_authenticate_request = async (request: NextRequest) => {
  return await verifyToken(request);
};
