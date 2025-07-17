"use client";
import { useState, useEffect } from "react";
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Navigation from "@/components/Navigation";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import Link from 'next/link';

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

function formatDateInputToBR(dateString: string) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export default function ContatosPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Estado do formulário
  const [form, setForm] = useState({ id: null as number | null, name: '', phone: '', birthday: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({ id: null, name: '', phone: '', birthday: '' });
    setIsEditing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.name || !form.phone || !form.birthday) {
        showToast('error', 'Preencha todos os campos.');
        setLoading(false);
        return;
      }
      // Garante que a data enviada está no formato correto
      const birthday = form.birthday;
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing
        ? { id: form.id, name: form.name, phone: form.phone, birthday }
        : { name: form.name, phone: form.phone, birthday };
      const res = await fetch('/api/contacts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Erro ao salvar contato.');
      } else {
        showToast('success', isEditing ? 'Contato editado com sucesso!' : 'Contato adicionado com sucesso!');
        fetchContacts();
        resetForm();
      }
    } catch (error) {
      showToast('error', 'Erro ao salvar contato.');
    }
    setLoading(false);
  }

  function handleEdit(contact: any) {
    // Corrigir para garantir que a data seja exibida corretamente no input type=date
    let date = '';
    if (contact.birthday) {
      const d = new Date(contact.birthday);
      // Ajusta para o fuso local, pegando apenas a parte da data
      date = d.toISOString().slice(0, 10);
    }
    setForm({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      birthday: date,
    });
    setIsEditing(true);
  }

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

            {/* Formulário de adicionar/editar contato */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 md:p-6 border border-indigo-200 mb-6 flex flex-col gap-4 max-w-xl mx-auto">
              <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-2">{isEditing ? 'Editar Contato' : 'Adicionar Novo Contato'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefone (somente números)"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                  required
                />
                <div className="flex flex-col gap-1">
                  {isEditing && form.birthday && (
                    <span className="text-xs text-gray-600">Data atual: <b>{formatDateInputToBR(form.birthday)}</b></span>
                  )}
                  <input
                    type="date"
                    name="birthday"
                    placeholder="Data de Nascimento"
                    value={form.birthday}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                    required
                  />
                </div>
              </div>
              {/* Atalho para importar contatos */}
              <div className="flex justify-end mt-2">
                <Link href="/importar" className="text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Importar contatos em lote
                </Link>
              </div>
              <div className="flex gap-2 justify-end">
                {isEditing && (
                  <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors">Cancelar</button>
                )}
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg border border-indigo-300 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors disabled:opacity-60">
                  {loading ? (isEditing ? 'Salvando...' : 'Adicionando...') : (isEditing ? 'Salvar Alterações' : 'Adicionar')}
                </button>
              </div>
            </form>

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
                                onClick={() => handleEdit(c)}
                                className="px-3 py-1 rounded-lg font-semibold shadow text-xs transition-colors border bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 cursor-pointer"
                              >
                                Editar
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