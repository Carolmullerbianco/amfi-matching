import React from 'react';

export const Originadores: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Originadores</h1>
        <p className="mt-2 text-gray-600">
          Gerencie os originadores cadastrados no sistema
        </p>
      </div>
      
      <div className="card p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Página em Desenvolvimento
        </h3>
        <p className="text-gray-500">
          A funcionalidade completa de CRUD para originadores estará disponível em breve.
        </p>
      </div>
    </div>
  );
};