import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';

const prisma = new PrismaClient();

// Função para converter data para fuso horário local (GMT-3)
function parseLocalDate(dateString: string): Date {
  // Se a data vier como string no formato DD/MM/YYYY
  if (typeof dateString === 'string' && dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    // Cria a data no fuso horário local (GMT-3)
    return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
  }
  
  // Se for uma string ISO (YYYY-MM-DD) do Excel
  if (typeof dateString === 'string' && dateString.includes('-') && dateString.length === 10) {
    const [year, month, day] = dateString.split('-');
    // Cria a data no fuso horário local (GMT-3)
    return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
  }
  
  // Se for um objeto Date ou string ISO, converte para local
  const date = new Date(dateString);
  // Ajusta para o fuso horário local
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  );
  return localDate;
}

// Função para ler arquivo CSV
async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const arrayBuffer = file.arrayBuffer();
    
    arrayBuffer.then(buffer => {
      const text = new TextDecoder().decode(buffer);
      const stream = Readable.from(text);
      
      stream
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: any) => reject(error));
    }).catch(reject);
  });
}

// Função para ler arquivo Excel
async function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    file.arrayBuffer().then(buffer => {
      try {
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    }).catch(reject);
  });
}

export async function POST(req: NextRequest) {
  try {
    // Recebe o arquivo da requisição (espera multipart/form-data)
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 });
    }

    // Verifica o tipo de arquivo
    const fileName = file.name.toLowerCase();
    let json: any[];

    if (fileName.endsWith('.csv')) {
      // Processa arquivo CSV
      json = await parseCSV(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Processa arquivo Excel
      json = await parseExcel(file);
    } else {
      return NextResponse.json({ 
        error: 'Formato de arquivo não suportado. Use .csv, .xlsx ou .xls' 
      }, { status: 400 });
    }

    // Espera colunas: nome, telefone, data de nascimento
    const contatos = json.map((row) => {
      const rawDate = row['data de nascimento'] || row['birthday'];
      const parsedDate = parseLocalDate(rawDate);
      
      return {
        name: row['nome'] || row['name'],
        phone: String(row['telefone'] || row['phone']),
        birthday: parsedDate,
        enabled: true,
      };
    });

    // Salva todos os contatos no banco
    await prisma.contact.createMany({ data: contatos });

    return NextResponse.json({ success: true, count: contatos.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar a planilha.' }, { status: 500 });
  }
} 