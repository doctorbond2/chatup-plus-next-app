import { NextResponse, NextRequest } from 'next/server';
import { Todo } from '@/types/Todo';
import { todo_collection } from '@/utils/db';
import { error500 } from '../error';
export async function CreateTodo(req: NextRequest) {
  try {
    const body: Todo = await req.json();
    if (!body.name) {
      return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
    }

    body.id = todo_collection.length + 1;
    body.completed = false;
    todo_collection.push(body);
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error(error);
    return error500();
  }
}
