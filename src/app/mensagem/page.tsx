"use client";
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Navigation from "@/components/Navigation";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

export default function MensagemPage() {
  const [message, setMessage] = useState("");
  const [sendTime, setSendTime] = useState("");
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const { toast, showToast } = useToast();

  // Carregar configuração existente
  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setConfigLoading(true);
    try {
      const res = await fetch("/api/messageConfig");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setMessage(data.text || "");
          setSendTime(data.sendTime || "");
        }
      }
    } catch (error) {
      showToast("error", "Erro ao carregar configuração.");
    } finally {
      setConfigLoading(false);
    }
  }

  async function handleConfigSave(e: React.FormEvent) {
    e.preventDefault();
    setConfigLoading(true);
    
    try {
      const res = await fetch("/api/messageConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, sendTime }),
      });
      
      if (res.ok) {
        setConfigSaved(true);
        showToast("success", "Configuração salva com sucesso!");
        setTimeout(() => setConfigSaved(false), 2000);
      } else {
        showToast("error", "Erro ao salvar configuração.");
      }
    } catch (error) {
      showToast("error", "Erro ao salvar configuração.");
    } finally {
      setConfigLoading(false);
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
              <CheckCircleIcon className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              Mensagem Padrão
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Configure a mensagem que será enviada automaticamente nos aniversários.
            </p>
          </div>

          {/* Configuração de Mensagem */}
          <section className="mb-6 md:mb-8">
            <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col gap-4 border border-green-100">
              <h2 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-900">
                <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6" /> 
                Mensagem de Aniversário
              </h2>
              
              <form onSubmit={handleConfigSave} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem de aniversário:
                  </label>
                  <textarea
                    id="message"
                    className="border rounded-lg p-3 resize-none text-gray-800 bg-gray-50 w-full text-sm md:text-base"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Parabéns, {nome}! Que este dia seja especial e cheio de alegria. 🎉"
                    required
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-green-700">Dica:</span> Use <code className="bg-green-100 px-1 rounded">{'{nome}'}</code> para inserir o nome do contato na mensagem.<br />
                    Exemplo: <span className="italic">Parabéns, {'{nome}'}! Aproveite seu dia!</span>
                  </p>
                </div>
                
                <div>
                  <label htmlFor="sendTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Horário de envio:
                  </label>
                  <input
                    id="sendTime"
                    type="time"
                    className="border rounded-lg p-2 text-gray-800 bg-gray-50 text-sm md:text-base"
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                    required
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Horário em que as mensagens serão enviadas automaticamente
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow hover:bg-green-800 transition disabled:opacity-50 font-semibold text-sm md:text-base"
                  disabled={configLoading}
                >
                  {configLoading ? "Salvando..." : "Salvar Configuração"}
                </button>
                
                {configSaved && (
                  <div className="text-green-700 font-medium flex items-center gap-2 text-sm md:text-base">
                    <CheckCircleIcon className="h-4 w-4 md:h-5 md:w-5" />
                    Configuração salva com sucesso!
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Preview da mensagem */}
          {message && (
            <section className="mb-6 md:mb-8">
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-blue-100">
                <h3 className="font-bold text-base md:text-lg text-gray-900 mb-4">📱 Preview da Mensagem</h3>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                  <div className="text-xs md:text-sm text-blue-900 mb-2 font-semibold">Exemplo de como ficará a mensagem:</div>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300 text-base md:text-lg text-gray-900 font-medium shadow-sm">
                    {message.replace('{nome}', 'João Silva')}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Informações */}
          <section>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
              <h3 className="font-bold text-base md:text-lg text-blue-900 mb-2">ℹ️ Como funciona</h3>
              <ul className="text-blue-800 space-y-1 text-sm md:text-base">
                <li>• A mensagem será enviada automaticamente no horário configurado</li>
                <li>• <b>Personalização:</b> Use <code className="bg-green-100 px-1 rounded">{'{nome}'}</code> para inserir o nome do contato na mensagem e deixá-la mais pessoal</li>
                <li>• Apenas contatos ativos receberão as mensagens</li>
                <li>• O sistema verifica diariamente os aniversariantes</li>
                <li>• Você pode alterar a mensagem a qualquer momento</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 