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

export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID não informado.' }, { status: 400 });
    }
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact || contact.userId !== user.id) {
      return NextResponse.json({ error: 'Contato não encontrado.' }, { status: 404 });
    }
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar contato.' }, { status: 500 });
  }
} 