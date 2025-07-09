import { ReactElement, useState, useEffect, useRef } from "react";
import ContainerLayout from "@/components/layouts/ContainerLayout";

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'session=eyJjaGF0X2hpc3RvcnkiOltdfQ.aG0a3A.LQIs_ABaBMp6xXmDsg4MhR2ruwA'
        },
        body: `Body=${encodeURIComponent(inputMessage)}`
      });

      const responseText = await response.text();
      const parsedMessage = parseXMLResponse(responseText);
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, text: parsedMessage, isLoading: false }
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, text: 'Error: No se pudo conectar con el servicio', isLoading: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-3/5 border border-orange-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16l3.5-2.5L15.5 16 12 13.5z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">BigHead</h1>
              <p className="text-lg text-orange-600 font-medium mb-1">Asistente Virtual</p>
              <p className="text-gray-600">Food Service 2024</p>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  Tu asistente especializado en eventos gastronómicos
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg"
              >
                Comenzar Chat
              </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="w-4/5 h-full max-h-screen mx-auto">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">BigHead Assistant</h2>
                  <p className="text-orange-100 text-sm">Especialista en Food Service 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-orange-100">En línea</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-orange-25 to-white">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16l3.5-2.5L15.5 16 12 13.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Bienvenido al Food Service 2024!</h3>
                  <p className="text-gray-600 mb-4">Soy BigHead, tu asistente virtual especializado en eventos gastronómicos.</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-orange-800">
                      Puedes preguntarme sobre menús, reservas, eventos especiales, y todo lo relacionado con nuestros servicios gastronómicos.
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
                        ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
                    }`}>
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
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
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
                          <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                        )}
                      </div>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right text-orange-600' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-orange-200 p-4 flex-shrink-0">
              <form onSubmit={sendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu mensaje sobre Food Service 2024..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
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