import { NextRequest, NextResponse } from 'next/server';

export default function userHandler_LoginUser(req: NextRequest) {
  return NextResponse.json({ message: 'Hello World' });
}
