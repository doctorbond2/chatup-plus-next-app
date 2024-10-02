import { NextRequest } from 'next/server';
import { verifyToken } from '../helpers/auth';
import { validateApiKey } from '../helpers/auth';
export const middleware_authenticate_request = async (request: NextRequest) => {
  const errors = [];
  const tokenOK = await verifyToken(request);
  const keyOK = validateApiKey(request);
  if (!tokenOK) {
    errors.push('Invalid token');
  }
  if (!keyOK) {
    errors.push('Invalid key');
  }
  return {
    hasErrors: errors.length > 0,
    errors,
  };
};
