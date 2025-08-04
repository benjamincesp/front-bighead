import React, { ReactElement, useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export default function IndexPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showQuickButtons, setShowQuickButtons] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const parseXMLResponse = (xmlString: string): string => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const messageElement = xmlDoc.querySelector("Message");
      return messageElement?.textContent || xmlString;
    } catch (error) {
      return xmlString;
    }
  };

  const parseMarkdownBold = (text: string): JSX.Element => {
    // Dividir el texto por **texto** y crear elementos JSX
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Remover los ** y hacer el texto bold
            const boldText = part.slice(2, -2);
            return <strong key={index}>{boldText}</strong>;
          }
          // Mantener los saltos de línea y espacios
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  };

  const formatBotResponse = (response: string): string => {
    // Hacer bold las fechas que contienen el patrón específico
    let formattedResponse = response;
    
    // Patrón para fechas como "30 Sep - 1 y 2 Oct 2025" o "SEP 30 - OCT 01/02 2025"
    const datePatterns = [
      /📅\s*(30\s+Sep\s*-\s*1\s+y\s+2\s+Oct\s+2025)/gi,
      /📅\s*(SEP\s+30\s*-\s*OCT\s+01\/02\s+2025)/gi,
      /(30\s+Sep\s*-\s*1\s+y\s+2\s+Oct\s+2025)/gi,
      /(SEP\s+30\s*-\s*OCT\s+01\/02\s+2025)/gi
    ];
    
    datePatterns.forEach(pattern => {
      formattedResponse = formattedResponse.replace(pattern, (match, dateGroup) => {
        if (match.includes('📅')) {
          return `📅 **${dateGroup}**`;
        } else {
          return `**${dateGroup}**`;
        }
      });
    });

    // Si la respuesta ya tiene el formato corporativo, devolverla tal como está
    if (response.includes('🍊 **ESPACIO FOOD & SERVICE 2025**') || response.includes('🧡🍊')) {
      return formattedResponse;
    }

    // Agregar saludo inicial si es la primera interacción
    if (messages.length === 0) {
      return `🧡🍊 ¡Hola! Soy tu asistente de Espacio Food & Service 2025 🧡🍊

📅 **30 Sep - 1 y 2 Oct 2025**
📍 **Centro de Eventos Espacio Riesco**

${formattedResponse}

**¿Necesitas más información sobre:**
• Stands disponibles
• Programación de eventos  
• Proceso de inscripción
• Contacto directo

---
🌱 **Espacio Food & Service 2025**
*La feria más importante de la industria alimentaria de Latinoamérica*`;
    }

    return formattedResponse;
  };

  const quickResponses = [
    "Ver Stands Disponibles",
    "Programación",
    "Proceso de Inscripción", 
    "Contacto"
  ];

  const handleQuickResponse = async (quickResponse: string) => {
    setShowQuickButtons(false);
    const event = { preventDefault: () => {} } as React.FormEvent;
    setInputMessage(quickResponse);
    
    // Usar setTimeout para permitir que el estado se actualice
    setTimeout(() => {
      sendMessage(event);
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'session=eyJjaGF0X2hpc3RvcnkiOltdfQ.aG0a3A.LQIs_ABaBMp6xXmDsg4MhR2ruwA'
        },
        body: `Body=${encodeURIComponent(inputMessage)}`,
        // Agregar timeout y configuración para manejar conexiones inestables
        signal: AbortSignal.timeout(60000) // 1 minuto timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const parsedMessage = parseXMLResponse(responseText);
      const formattedMessage = formatBotResponse(parsedMessage);
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, text: formattedMessage, isLoading: false }
          : msg
      ));
    } catch (error) {
      console.error('Error en la solicitud:', error);
      let errorMessage = 'Error: No se pudo conectar con el servicio';
      
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          errorMessage = 'Error: La solicitud tardó demasiado tiempo';
        } else if (error.message.includes('ECONNRESET')) {
          errorMessage = 'Error: Conexión interrumpida, intenta nuevamente';
        }
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, text: errorMessage, isLoading: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
      // Mantener el focus en el input después de enviar el mensaje
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-3/5 border border-green-100">
            <div className="text-center mb-8">
              <div className="max-w-96 max-h-96 mx-auto mb-6 flex items-center justify-center">
                <img 
                  src="/assets/images/logo.png" 
                  alt="Espacio Food Service Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{color: '#607D8B'}}>ESPACIO FOOD & SERVICE</h1>
              <p className="text-lg font-bold" style={{color: '#FF6F00'}}>SEP 30 - OCT 01/02 2025</p>
              <p className="text-gray-600 font-medium">📍 ESPACIO RIESCO</p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm" style={{color: '#2E7D32'}}>
                  🧡 ¡Hola! Soy tu asistente de Espacio Food & Service 2025 🧡🍊
                </p>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuál es tu nombre?
                </label>
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-white py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:opacity-90"
                style={{backgroundColor: '#FF6F00'}}
              >
                Comenzar Chat
              </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-lime-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="w-4/5 h-full max-h-screen mx-auto">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-6 text-white" style={{background: 'linear-gradient(135deg, #4CAF50 0%, #FF6F00 100%)'}}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center p-1">
                  <img 
                    src="/assets/images/logo.png" 
                    alt="Espacio Food Service Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">ESPACIO FOOD & SERVICE 2025</h2>
                  <p className="text-green-100 text-sm font-medium">📅 <span className="font-bold">30 Sep - 1 y 2 Oct 2025</span> | 📍 Espacio Riesco</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-100">En línea</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-green-25 to-white">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/assets/images/logo.png" 
                      alt="Espacio Food Service Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: '#607D8B'}}>¡Bienvenido a Espacio Food & Service 2025!</h3>
                  <p className="font-bold mb-1" style={{color: '#FF6F00'}}>📅 SEP 30 - OCT 01/02 2025</p>
                  <p className="text-gray-600 mb-4">📍 Centro de Eventos Espacio Riesco</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm" style={{color: '#2E7D32'}}>
                      🧡 Soy tu asistente virtual especializado en la feria más importante de la industria alimentaria de Latinoamérica 🍊
                    </p>
                  </div>
                </div>
              )}
              
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'text-white' 
                        : 'text-white'
                    }`} style={{
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #607D8B, #455A64)' 
                        : 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                    }}>
                      {message.sender === 'user' ? (
                        <span className="text-sm font-bold">{userName.charAt(0).toUpperCase()}</span>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16l3.5-2.5L15.5 16 12 13.5z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-lg ${
                          message.sender === 'user'
                            ? 'text-white border-gray-300'
                            : 'text-gray-900 border border-green-200'
                        }`}
                        style={{
                          background: message.sender === 'user'
                            ? '#F5F5F5'
                            : '#8BC34A',
                          color: message.sender === 'user'
                            ? '#2E7D32'
                            : 'white'
                        }}
                      >
                        {message.isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-500">BigHead está escribiendo...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {parseMarkdownBold(message.text)}
                          </div>
                        )}
                      </div>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : ''}`} style={{color: message.sender === 'user' ? '#607D8B' : '#607D8B'}}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Quick Response Buttons */}
              {showQuickButtons && messages.length === 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickResponse(response)}
                      className="px-4 py-2 text-white rounded-full text-sm font-medium shadow-lg hover:opacity-90 transition-all duration-200"
                      style={{backgroundColor: '#FF6F00'}}
                    >
                      {response}
                    </button>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-green-200 p-4 flex-shrink-0">
              <form onSubmit={sendMessage} className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pregúntame sobre Espacio Food & Service 2025..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:opacity-90"
                  style={{backgroundColor: '#FF6F00'}}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>{page}</>
  );
};