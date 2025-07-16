"use client";
import { useState, useEffect } from "react";
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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

export default function ContatosPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Carregar contatos somente se autenticado
  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  // Filtrar contatos baseado na busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        formatDate(contact.birthday).includes(searchTerm)
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      showToast("error", "Erro ao carregar contatos.");
    }
  }

  async function handleToggle(id: number) {
    try {
      await fetch(`/api/contact/${id}/toggle`, { method: "PATCH" });
      fetchContacts();
      showToast("success", "Status do contato atualizado!");
    } catch (error) {
      showToast("error", "Erro ao atualizar contato.");
    }
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetch("/api/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });
      setDeleteId(null);
      setConfirmOpen(false);
      fetchContacts();
      showToast("success", "Contato deletado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao deletar contato.");
    }
  }

  return (
    <AuthGuard>
      {/* Popup de confirmação de deleção */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full border border-red-200 flex flex-col items-center">
            <div className="text-red-600 text-2xl mb-2 font-bold">Excluir contato?</div>
            <div className="text-gray-700 text-center mb-6">Essa ação <b>não pode ser desfeita</b>.<br/>Tem certeza que deseja excluir este contato?</div>
            <div className="flex gap-4 w-full mt-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors cursor-pointer"
              >Cancelar</button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg border border-red-300 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer"
              >Excluir</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 md:ml-0 pt-16 md:pt-8 px-4 md:px-12 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Toast */}
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => {}} />}
            
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-2 text-gray-900">
                <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-indigo-500" />
                Contatos
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Gerencie todos os seus contatos cadastrados{user ? `, ${user.name}` : ""}</p>
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
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {contacts.filter(c => c.enabled).length}
                    </div>
                    <div className="text-gray-600 text-sm md:text-base">Contatos Ativos</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-red-100 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 md:h-8 md:w-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs md:text-sm">✗</span>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {contacts.filter(c => !c.enabled).length}
                    </div>
                    <div className="text-gray-600 text-sm md:text-base">Contatos Inativos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Busca */}
            <section className="mb-6">
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  <h2 className="font-bold text-base md:text-lg text-gray-900">Buscar Contatos</h2>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nome, telefone ou data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {searchTerm && (
                  <div className="mt-2 text-xs md:text-sm text-gray-600">
                    {filteredContacts.length} contato(s) encontrado(s)
                  </div>
                )}
              </div>
            </section>

            {/* Listagem de Contatos */}
            <section>
              <div className="bg-white rounded-xl shadow border border-indigo-100">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <h2 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-900">
                    <UserIcon className="h-5 w-5 md:h-6 md:w-6" /> 
                    Contatos Cadastrados
                  </h2>
                </div>
                
                {/* Tabela com rolagem fixa */}
                <div className="overflow-x-auto">
                  <div className="max-h-[600px] md:max-h-[700px] overflow-y-auto">
                    <table className="min-w-full text-xs md:text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="border-b p-2 md:p-3 text-left text-gray-800 font-semibold">Nome</th>
                          <th className="border-b p-2 md:p-3 text-left text-gray-800 font-semibold hidden sm:table-cell">Telefone</th>
                          <th className="border-b p-2 md:p-3 text-left text-gray-800 font-semibold hidden md:table-cell">Data Nasc.</th>
                          <th className="border-b p-2 md:p-3 text-center text-gray-800 font-semibold">Status</th>
                          <th className="border-b p-2 md:p-3 text-center text-gray-800 font-semibold">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((c) => (
                          <tr key={c.id} className="hover:bg-indigo-50 transition-colors">
                            <td className="border-b p-2 md:p-3 text-gray-900 font-medium">
                              <div>
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs text-gray-500 sm:hidden">{formatPhone(c.phone)}</div>
                              </div>
                            </td>
                            <td className="border-b p-2 md:p-3 text-gray-900 hidden sm:table-cell">{formatPhone(c.phone)}</td>
                            <td className="border-b p-2 md:p-3 text-gray-900 hidden md:table-cell">{formatDate(c.birthday)}</td>
                            <td className="border-b p-2 md:p-3 text-center">
                              {c.enabled ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Ativo
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Inativo
                                </span>
                              )}
                            </td>
                            <td className="border-b p-2 md:p-3 text-center flex gap-2 justify-center">
                              <button
                                onClick={() => handleToggle(c.id)}
                                className={`px-3 py-1 rounded-lg font-semibold shadow text-xs transition-colors border ${c.enabled ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'} cursor-pointer`}
                              >
                                {c.enabled ? 'Desativar' : 'Ativar'}
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="px-3 py-1 rounded-lg font-semibold shadow text-xs transition-colors border bg-red-100 text-red-700 border-red-200 hover:bg-red-200 cursor-pointer"
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredContacts.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center p-6 md:p-8 text-gray-500 text-sm md:text-base">
                              {searchTerm ? "Nenhum contato encontrado com essa busca." : "Nenhum contato cadastrado."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 