import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar contatos.' }, { status: 500 });
  }
} 