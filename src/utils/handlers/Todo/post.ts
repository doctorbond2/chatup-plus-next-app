import { NextResponse, NextRequest } from 'next/server';
import { Todo } from '@/types/Todo';
import prisma from '@/lib/prisma';
import { error500 } from '../error';
export async function CreateTodo(req: NextRequest) {
  try {
    const body: Todo = await req.json();
    if (!body.name) {
      return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
    }

    body.completed = false;
    await prisma.todo.create({ data: body });
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error(error);
    return error500();
  }
}
