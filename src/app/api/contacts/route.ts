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

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const { name, phone, birthday } = await req.json();
    if (!name || !phone || !birthday) {
      return NextResponse.json({ error: 'Dados obrigatórios não enviados.' }, { status: 400 });
    }
    const exists = await prisma.contact.findFirst({ where: { phone, userId: user.id } });
    if (exists) {
      return NextResponse.json({ error: 'Contato já existe.' }, { status: 400 });
    }
    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
        birthday: new Date(birthday),
        userId: user.id,
        enabled: true,
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar contato.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const { id, name, phone, birthday } = await req.json();
    if (!id || !name || !phone || !birthday) {
      return NextResponse.json({ error: 'Dados obrigatórios não enviados.' }, { status: 400 });
    }
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact || contact.userId !== user.id) {
      return NextResponse.json({ error: 'Contato não encontrado.' }, { status: 404 });
    }
    // Verifica se já existe outro contato com o mesmo telefone
    const duplicate = await prisma.contact.findFirst({
      where: {
        phone,
        userId: user.id,
        NOT: { id },
      },
    });
    if (duplicate) {
      return NextResponse.json({ error: 'Já existe outro contato com este telefone.' }, { status: 400 });
    }
    // Corrigir data para UTC (evitar problemas de fuso)
    const [year, month, day] = birthday.split('-');
    const birthdayUTC = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    const updated = await prisma.contact.update({
      where: { id },
      data: {
        name,
        phone,
        birthday: birthdayUTC,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao editar contato.' }, { status: 500 });
  }
} 