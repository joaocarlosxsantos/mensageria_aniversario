/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    // Botões e badges
    'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-100', 'text-green-700', 'text-green-800', 'border-green-100', 'border-green-200', 'border-green-300',
    'bg-blue-600', 'bg-blue-700', 'bg-blue-100', 'bg-blue-200', 'text-blue-900', 'text-blue-100', 'border-blue-100', 'border-blue-200', 'border-blue-300',
    'bg-pink-500', 'bg-pink-600', 'bg-pink-100', 'border-pink-100',
    'bg-purple-500', 'bg-purple-100', 'border-purple-100',
    'bg-red-100', 'bg-red-200', 'bg-red-500', 'text-red-700', 'text-red-800', 'border-red-100', 'border-red-200',
    'bg-yellow-100', 'bg-yellow-200', 'text-yellow-800', 'border-yellow-300',
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'text-indigo-700', 'text-indigo-800', 'border-indigo-100', 'border-indigo-200',
    // Utilitários
    'rounded-lg', 'rounded-xl', 'rounded-full', 'shadow', 'shadow-lg', 'shadow-sm', 'transition-colors', 'transition-shadow', 'hover:bg-green-600', 'hover:bg-blue-700', 'hover:bg-blue-200', 'hover:bg-red-200', 'hover:bg-yellow-200', 'hover:bg-indigo-50', 'hover:bg-gray-200', 'hover:bg-gray-300',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'font-bold', 'font-semibold', 'font-medium', 'font-extrabold',
    'flex', 'items-center', 'justify-center', 'gap-2', 'gap-3', 'gap-4', 'gap-8', 'min-h-screen', 'max-w-4xl', 'mx-auto', 'p-4', 'p-6', 'p-8', 'pt-8', 'pt-16', 'pb-8', 'mb-2', 'mb-4', 'mb-6', 'mb-8', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'w-full', 'w-10', 'w-12', 'w-16', 'w-8', 'h-5', 'h-6', 'h-8', 'h-10', 'h-12', 'h-16',
    'border', 'border-b', 'border-t', 'border-l', 'border-r', 'border-gray-100', 'border-gray-200', 'border-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900', 'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gradient-to-br', 'from-gray-100', 'to-gray-200',
    'sticky', 'top-0', 'top-4', 'right-4', 'left-4', 'z-40', 'z-50', 'fixed', 'absolute', 'relative', 'overflow-x-auto', 'overflow-y-auto', 'max-h-[600px]', 'max-h-[700px]', 'truncate', 'drop-shadow', 'animate-spin', 'cursor-pointer', 'disabled:opacity-60', 'transition', 'transition-all',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}; 