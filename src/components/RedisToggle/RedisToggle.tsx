import React from 'react';

interface RedisToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const RedisToggle: React.FC<RedisToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-green-200/50">
      <div className="flex items-center space-x-2">
        <label 
          htmlFor="redis-toggle" 
          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          title="Activar Redis mejora el rendimiento pero consume más recursos"
        >
          Redis
        </label>
        
        <div className="relative">
          <input
            id="redis-toggle"
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only"
          />
          <div
            onClick={() => onToggle(!isEnabled)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out
              ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm
                ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </div>
        </div>
        
        <span 
          className={`text-xs font-medium ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}
          title="Activar Redis mejora el rendimiento pero consume más recursos"
        >
          {isEnabled ? 'Activado' : 'Desactivado'}
        </span>
      </div>
    </div>
  );
};

export default RedisToggle;