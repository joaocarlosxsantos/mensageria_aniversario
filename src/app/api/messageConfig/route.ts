import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const config = await prisma.messageConfig.findFirst({ where: { userId: user.id } });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configuração.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const { text, sendTime } = await req.json();
    if (!text || !sendTime) {
      return NextResponse.json({ error: 'Dados obrigatórios não enviados.' }, { status: 400 });
    }
    // Atualiza se existir, senão cria
    const existing = await prisma.messageConfig.findFirst({ where: { userId: user.id } });
    let config;
    if (existing) {
      config = await prisma.messageConfig.update({
        where: { id: existing.id },
        data: { text, sendTime },
      });
    } else {
      config = await prisma.messageConfig.create({ data: { text, sendTime, userId: user.id } });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configuração.' }, { status: 500 });
  }
} 