import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { sendWhatsappMessage } from '@/utils/whatsapp'; // será implementado

const prisma = new PrismaClient();

function isBirthdayToday(date: Date) {
  const today = new Date();
  
  // Converte ambas as datas para o fuso horário local
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const localBirthday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return (
    localBirthday.getDate() === localToday.getDate() &&
    localBirthday.getMonth() === localToday.getMonth()
  );
}

export async function POST() {
  try {
    // Busca aniversariantes do dia
    const contacts = await prisma.contact.findMany({ where: { enabled: true } });
    const aniversariantes = contacts.filter((c: any) => isBirthdayToday(new Date(c.birthday)));

    if (aniversariantes.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'Nenhum aniversariante hoje.' });
    }

    // Busca mensagem padrão
    const config = await prisma.messageConfig.findFirst();
    if (!config) {
      return NextResponse.json({ error: 'Mensagem padrão não configurada.' }, { status: 400 });
    }

    // Envia mensagem para cada aniversariante
    let enviados = 0;
    for (const contato of aniversariantes) {
      // await sendWhatsappMessage(contato.phone, config.text); // implementar utilitário
      enviados++;
    }

    return NextResponse.json({ success: true, sent: enviados });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar mensagens.' }, { status: 500 });
  }
} 