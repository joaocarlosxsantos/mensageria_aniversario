"use client";
import { useState, useEffect } from "react";
import { CakeIcon, UserIcon } from "@heroicons/react/24/outline";
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
