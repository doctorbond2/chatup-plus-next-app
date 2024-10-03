import ResponseError from '@/models/classes/responseError';

export async function GET(): Promise<Response> {
  return ResponseError.default.unauthorized();
}
