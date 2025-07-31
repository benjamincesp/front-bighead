import React from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  const handleGoToChat = () => {
    router.push('/');
  };

  return (
    <React.Fragment>
      <div className="container ">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16l3.5-2.5L15.5 16 12 13.5z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BigHead Food Service</h1>
          <p className="text-xl text-orange-600 mb-6">Especialistas en Eventos Gastronómicos 2025</p>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Bienvenido a BigHead Food Service, tu socio estratégico para eventos gastronómicos excepcionales. 
            Ofrecemos soluciones integrales de catering, organización de eventos y consultoría gastronómica.
          </p>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8 border border-orange-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h2>
            <p className="text-gray-700 mb-6">
              Nuestro asistente virtual BigHead está aquí para ayudarte con información sobre nuestros servicios, 
              menús, reservas y eventos especiales.
            </p>
            <button
              onClick={handleGoToChat}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-8 rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg text-lg"
            >
              Chatear con BigHead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Catering Premium</h3>
            <p className="text-gray-600">Servicios de catering de alta calidad para eventos corporativos y sociales.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Organización de Eventos</h3>
            <p className="text-gray-600">Planificación completa de eventos gastronómicos desde la conceptualización hasta la ejecución.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultoría Gastronómica</h3>
            <p className="text-gray-600">Asesoramiento especializado en desarrollo de menús y optimización de procesos culinarios.</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;