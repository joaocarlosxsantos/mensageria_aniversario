import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

export function getUserFromRequest(req: NextRequest): { id: number; name: string; email: string } | null {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { id: decoded.userId, name: decoded.name, email: decoded.email };
  } catch {
    return null;
  }
} 