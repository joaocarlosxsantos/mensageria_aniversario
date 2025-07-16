import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const config = await prisma.messageConfig.findFirst();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configuração.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, sendTime } = await req.json();
    if (!text || !sendTime) {
      return NextResponse.json({ error: 'Dados obrigatórios não enviados.' }, { status: 400 });
    }
    // Atualiza se existir, senão cria
    const existing = await prisma.messageConfig.findFirst();
    let config;
    if (existing) {
      config = await prisma.messageConfig.update({
        where: { id: existing.id },
        data: { text, sendTime },
      });
    } else {
      config = await prisma.messageConfig.create({ data: { text, sendTime } });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configuração.' }, { status: 500 });
  }
} 