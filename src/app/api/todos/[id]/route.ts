import { NextResponse, NextRequest } from 'next/server';
import { todo_collection } from '@/utils/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (req.url) {
    return NextResponse.json({ message: 'GET todos' });
  }
  const id = parseInt(params.id);
  if (!todo_collection[id]) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(todo_collection[id], { status: 200 });
}
