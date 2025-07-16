"use client";
import { useState, useEffect } from "react";
import { CakeIcon, UserIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Navigation from "@/components/Navigation";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";

// Função para formatar telefone: (xx) xxxxx-xxxx
function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// Função para formatar data: dd/mm/aaaa
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

export default function Home() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [todayBirthdays, setTodayBirthdays] = useState<any[]>([]);
  const [sent, setSent] = useState<{ [id: number]: boolean }>({});
  const { toast, showToast } = useToast();
  const { user, loading } = useAuth();

  // Carregar contatos somente se autenticado
  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  useEffect(() => {
    if (contacts.length > 0) {
      const today = new Date();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      
      setTodayBirthdays(
        contacts.filter((c) => {
          const birthday = new Date(c.birthday);
          return birthday.getMonth() === todayMonth && birthday.getDate() === todayDay;
        })
      );
    }
  }, [contacts]);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      showToast("error", "Erro ao carregar contatos.");
    }
  }

  // Função para gerar link do WhatsApp
  function getWhatsappLink(phone: string, name: string) {
    // Busca mensagem padrão do contato
    const config = localStorage.getItem('messageConfig');
    let message = "Feliz aniversário, {nome}!";
    if (config) {
      try {
        const parsed = JSON.parse(config);
        if (parsed.text) message = parsed.text;
      } catch {}
    }
    message = message.replace("{nome}", name);
    // Formata telefone para formato internacional (ex: 55 + DDD + número)
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && !cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 md:ml-0 pt-16 md:pt-8 px-4 md:px-12 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Toast */}
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => {}} />}
            
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-2 text-gray-900">
                <CakeIcon className="h-6 w-6 md:h-8 md:w-8 text-pink-500" />
                Dashboard
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Bem-vindo{user ? `, ${user.name}` : ""} ao sistema de mensageria de aniversários
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-blue-100">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{contacts.length}</div>
                    <div className="text-gray-600 text-sm md:text-base">Total de Contatos</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 md:h-8 md:w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs md:text-sm">✓</span>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{todayBirthdays.length}</div>
                    <div className="text-gray-600 text-sm md:text-base">Aniversariantes Hoje</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-purple-100 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 md:h-8 md:w-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs md:text-sm">✓</span>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {contacts.filter(c => c.enabled).length}
                    </div>
                    <div className="text-gray-600 text-sm md:text-base">Contatos Ativos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aniversariantes de hoje */}
            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <CakeIcon className="h-5 w-5 md:h-6 md:w-6 text-pink-500" />
                Aniversariantes de hoje ({new Date().toLocaleDateString('pt-BR')})
              </h2>
              
              {todayBirthdays.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayBirthdays.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl shadow p-4 md:p-6 border border-pink-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 md:h-6 md:w-6 text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base md:text-lg text-gray-900 truncate">{c.name}</div>
                          <div className="text-gray-700 text-sm">{formatPhone(c.phone)}</div>
                          <div className="text-gray-500 text-xs">{formatDate(c.birthday)}</div>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-4 text-center">
                        <div className="text-pink-600 font-bold text-base md:text-lg">🎉 Feliz Aniversário!</div>
                      </div>
                      <a
                        href={getWhatsappLink(c.phone, c.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setSent((prev) => ({ ...prev, [c.id]: true }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow transition-colors text-base border cursor-pointer
                          ${sent[c.id]
                            ? 'bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300'
                            : 'bg-green-500 text-white border-green-600 hover:bg-green-600'}
                        `}
                        title="Enviar mensagem pelo WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                          <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.13 12.13 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.69.97.99-3.59-.24-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.4 0 4.68.84 6.5 2.36A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.26-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.62.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                        </svg>
                        {sent[c.id] ? 'Enviado' : 'WhatsApp'}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-6 md:p-8 border border-gray-100 text-center">
                  <CakeIcon className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-500 text-base md:text-lg">Nenhum aniversariante hoje</div>
                  <div className="text-gray-400 text-sm mt-2">Que tal importar alguns contatos?</div>
                </div>
              )}
            </section>

            {/* Ações rápidas */}
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href="/importar" 
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow transition-colors flex items-center gap-3"
                >
                  <UserIcon className="h-5 w-5 md:h-6 md:w-6" />
                  <div>
                    <div className="font-semibold text-sm md:text-base">Importar Contatos</div>
                    <div className="text-blue-100 text-xs md:text-sm">Adicionar novos contatos via planilha</div>
                  </div>
                </a>
                
                <a 
                  href="/mensagem" 
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow transition-colors flex items-center gap-3"
                >
                  <CakeIcon className="h-5 w-5 md:h-6 md:w-6" />
                  <div>
                    <div className="font-semibold text-sm md:text-base">Configurar Mensagem</div>
                    <div className="text-green-100 text-xs md:text-sm">Definir mensagem padrão de aniversário</div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
