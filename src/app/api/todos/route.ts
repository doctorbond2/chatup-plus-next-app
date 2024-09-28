import { NextResponse, NextRequest } from 'next/server';
import { todo_collection } from '@/utils/db';
import { CreateTodo } from '@/utils/handlers/Todo/post';
export async function GET() {
  return NextResponse.json(todo_collection, { status: 200 });
}
export async function POST(req: NextRequest) {
  return await CreateTodo(req);
}
