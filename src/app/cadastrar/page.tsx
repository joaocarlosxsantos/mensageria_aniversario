"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Se já autenticado, redireciona para /
  useEffect(() => {
    fetch("/api/auth/me").then(async (res) => {
      if (res.ok) {
        router.replace("/");
      }
    });
  }, [router]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.replace("/login"), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao cadastrar.");
      }
    } catch {
      setError("Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-800 tracking-tight drop-shadow">Criar Conta</h1>
        {error && <div className="mb-4 text-red-600 text-base font-semibold text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3">{error}</div>}
        {success && <div className="mb-4 text-green-700 text-base font-semibold text-center bg-green-50 border border-green-200 rounded-lg py-2 px-3">Cadastro realizado! Redirecionando...</div>}
        <div className="mb-4">
          <label className="block text-gray-800 font-semibold mb-1">Nome</label>
          <input type="text" className="w-full border-2 border-indigo-200 focus:border-indigo-500 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:bg-white transition" value={name} onChange={e => setName(e.target.value)} required autoFocus />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 font-semibold mb-1">Email</label>
          <input type="email" className="w-full border-2 border-indigo-200 focus:border-indigo-500 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:bg-white transition" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">Senha</label>
          <input type="password" className="w-full border-2 border-indigo-200 focus:border-indigo-500 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:bg-white transition" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 rounded-lg shadow transition-colors text-lg tracking-wide cursor-pointer disabled:opacity-60" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        <div className="mt-6 text-center text-base text-gray-700">
          Já tem conta? <a href="/login" className="text-indigo-700 hover:underline font-semibold">Entrar</a>
        </div>
      </form>
    </div>
  );
} 