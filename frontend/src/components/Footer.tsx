import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-4 text-sm text-gray-600 flex justify-between">
        <div>Universidad · Información institucional</div>
        <div className="space-x-4">
          <button
            onClick={() => window.alert('Contacto de soporte')}
            className="text-blue-600 hover:underline"
            aria-label="Soporte"
          >
            Soporte
          </button>
          <button
            onClick={() => window.alert('Mostrar políticas')}
            className="text-blue-600 hover:underline"
            aria-label="Políticas"
          >
            Políticas
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
