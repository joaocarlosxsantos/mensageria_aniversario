import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return NextResponse.json({ user: { id: decoded.userId, name: decoded.name, email: decoded.email } });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
} 