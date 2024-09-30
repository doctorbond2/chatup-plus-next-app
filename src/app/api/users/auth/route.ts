import ResponseError from '@/models/classes/responseError';

export function GET() {
  return ResponseError.default.unauthorized();
}
