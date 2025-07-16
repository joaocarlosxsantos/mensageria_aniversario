import axios from 'axios';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://api.ultramsg.com/instanceXXXXXX/messages/chat';
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || 'SEU_TOKEN_AQUI';

export async function sendWhatsappMessage(phone: string, text: string) {
  try {
    // Exemplo UltraMSG
    const payload = {
      to: phone,
      body: text,
      token: WHATSAPP_API_TOKEN,
    };
    const response = await axios.post(WHATSAPP_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao enviar mensagem WhatsApp:', error?.response?.data || error);
    throw new Error('Erro ao enviar mensagem WhatsApp');
  }
} 