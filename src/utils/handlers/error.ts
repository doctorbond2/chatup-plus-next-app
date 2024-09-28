import { NextResponse } from 'next/server';
export const error500 = async () => {
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  );
};
