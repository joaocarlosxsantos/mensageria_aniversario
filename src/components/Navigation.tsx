"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CakeIcon, ClipboardIcon, CheckCircleIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return null;

  const navigation = [
    { name: 'Início', href: '/', icon: CakeIcon },
    { name: 'Importar Contatos', href: '/importar', icon: ClipboardIcon },
    { name: 'Mensagem Padrão', href: '/mensagem', icon: CheckCircleIcon },
    { name: 'Contatos', href: '/contatos', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 cursor-pointer"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={classNames(
        "fixed inset-y-0 left-0 z-40 bg-white border-r shadow-lg transition-transform duration-300 ease-in-out",
        "md:relative md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6 gap-8">
          <div className="flex items-center gap-2 text-indigo-800 font-bold text-2xl">
            <CakeIcon className="h-8 w-8" />
            <span className="hidden sm:inline">Aniversários</span>
          </div>
          
          <nav className="flex flex-col gap-4 text-gray-700 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={classNames(
                    "flex items-center gap-2 font-medium transition-colors rounded-lg px-3 py-2",
                    isActive 
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200" 
                      : "hover:text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          {/* Usuário logado e logout */}
          <div className="mt-8 flex flex-col gap-2 items-start w-full">
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 w-full">
              <UserIcon className="h-5 w-5 text-indigo-500" />
              <span className="font-semibold text-indigo-800 truncate">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 mt-2 px-3 py-2 w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold rounded-lg shadow-sm transition-all text-sm justify-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6-3h12m0 0l-3-3m3 3l-3 3" />
              </svg>
              Sair
            </button>
          </div>
          
          <div className="text-xs text-gray-400 hidden sm:block">© {new Date().getFullYear()} Mensageria</div>
        </div>
      </aside>
    </>
  );
} 