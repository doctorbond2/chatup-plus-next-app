import { NextResponse } from 'next/server';
export const error500 = async () => {
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  );
};

export const error404 = async () => {
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
};

export const error400 = async () => {
  return NextResponse.json({ message: 'Bad request' }, { status: 400 });
};
export const error401 = async () => {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
};
export const error403 = async () => {
  return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
};
