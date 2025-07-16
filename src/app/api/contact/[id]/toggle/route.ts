import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, contextPromise: Promise<{ params: { id: string } }>) {
  const { params } = await contextPromise;
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }
    // Busca contato
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      return NextResponse.json({ error: 'Contato não encontrado.' }, { status: 404 });
    }
    // Alterna o status
    const updated = await prisma.contact.update({
      where: { id },
      data: { enabled: !contact.enabled },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar contato.' }, { status: 500 });
  }
} 