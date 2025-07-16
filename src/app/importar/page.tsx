"use client";
import { useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import Navigation from "@/components/Navigation";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

export default function ImportarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast, showToast } = useToast();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/uploadContacts", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        showToast("success", "Contatos importados com sucesso!");
        setFile(null);
        // Limpar o input de arquivo
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const error = await res.json();
        showToast("error", error.error || "Erro ao importar contatos.");
      }
    } catch (error) {
      showToast("error", "Erro ao importar contatos.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 md:ml-0 pt-16 md:pt-8 px-4 md:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Toast */}
          {toast && <Toast type={toast.type} message={toast.message} onClose={() => {}} />}
          
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-2 text-gray-900">
              <ClipboardIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              Importar Contatos
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Faça upload de uma planilha para importar seus contatos</p>
          </div>

          {/* Upload de Planilha */}
          <section className="mb-6 md:mb-8">
            <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col gap-4 border border-blue-100">
              <h2 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-900">
                <ClipboardIcon className="h-5 w-5 md:h-6 md:w-6" /> 
                Importar Contatos (.xlsx, .csv)
              </h2>
              
              {/* Aviso sobre formato da planilha */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 md:p-4 text-sm text-gray-800 mb-2">
                <div className="font-semibold mb-1 text-blue-900">Formato da planilha:</div>
                <div className="overflow-x-auto">
                  <table className="min-w-[280px] md:min-w-[350px] text-xs border mb-2">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1 bg-blue-100">nome</th>
                        <th className="border px-2 py-1 bg-blue-100">telefone</th>
                        <th className="border px-2 py-1 bg-blue-100">data de nascimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-2 py-1">João Silva</td>
                        <td className="border px-2 py-1">11999999999</td>
                        <td className="border px-2 py-1">1990-05-10</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">Maria Souza</td>
                        <td className="border px-2 py-1">21988888888</td>
                        <td className="border px-2 py-1">1985-12-25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ul className="list-disc pl-4 md:pl-5 mb-1 text-xs md:text-sm">
                  <li>Colunas aceitas: <b>nome</b> ou <b>name</b>, <b>telefone</b> ou <b>phone</b>, <b>data de nascimento</b> ou <b>birthday</b></li>
                  <li>Formato da data: <b>YYYY-MM-DD</b>, <b>DD/MM/YYYY</b> ou formato reconhecido pelo Excel</li>
                  <li>Telefone: apenas números, com DDD (ex: 11999999999)</li>
                  <li>Formatos aceitos: <b>.xlsx</b>, <b>.xls</b> e <b>.csv</b></li>
                </ul>
                <span className="text-blue-900 font-semibold text-xs md:text-sm">Todas as três informações são obrigatórias para cada contato.</span>
              </div>
              
              <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="border p-2 rounded w-full sm:w-auto text-gray-800 bg-gray-50 text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-4 md:px-6 py-2 rounded shadow hover:bg-blue-800 transition disabled:opacity-50 font-semibold text-sm md:text-base w-full sm:w-auto"
                  disabled={uploading || !file}
                >
                  {uploading ? "Importando..." : "Importar"}
                </button>
              </form>
            </div>
          </section>

          {/* Dicas */}
          <section>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 md:p-6">
              <h3 className="font-bold text-base md:text-lg text-yellow-900 mb-2">💡 Dicas para importação</h3>
              <ul className="text-yellow-800 space-y-1 text-sm md:text-base">
                <li>• Certifique-se de que a planilha tenha cabeçalhos na primeira linha</li>
                <li>• Verifique se os telefones estão no formato correto (apenas números)</li>
                <li>• As datas devem estar em formato reconhecível</li>
                <li>• Contatos duplicados serão ignorados automaticamente</li>
                <li>• Todos os contatos importados ficam ativos por padrão</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 