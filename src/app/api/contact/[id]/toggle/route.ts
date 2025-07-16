import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/utils/auth';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }
    const contact = await prisma.contact.findUnique({
      where: { id },
      select: { id: true, userId: true, enabled: true }
    });
    if (!contact || contact.userId !== user.id) {
      return NextResponse.json({ error: 'Contato não encontrado.' }, { status: 404 });
    }
    const updated = await prisma.contact.update({
      where: { id },
      data: { enabled: !contact.enabled },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar contato.' }, { status: 500 });
  }
}