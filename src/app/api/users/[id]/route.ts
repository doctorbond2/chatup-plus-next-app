import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/types/User';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'Returned user: ' + params.id });
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const asd: number = parseInt(params.id);
  console.log(asd);
  const body: User = await req.json();

  return NextResponse.json(body, { status: 200 });
}
