"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CakeIcon, ClipboardIcon, CheckCircleIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
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
          
          <div className="text-xs text-gray-400 hidden sm:block">© {new Date().getFullYear()} Mensageria</div>
        </div>
      </aside>
    </>
  );
} 