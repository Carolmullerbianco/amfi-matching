import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar originadores, investidores..."
                className="input-field pl-10 w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
          </button>

          {/* User menu */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </HeadlessMenu.Button>

            <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-4 py-3">
                <p className="text-sm text-gray-900">Logado como</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      className={clsx(
                        'group flex items-center w-full px-4 py-2 text-sm transition-colors',
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      )}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Perfil
                    </button>
                  )}
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={clsx(
                        'group flex items-center w-full px-4 py-2 text-sm transition-colors',
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      )}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sair
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </HeadlessMenu>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="input-field pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};