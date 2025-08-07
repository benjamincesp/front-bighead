import { useState, useEffect } from 'react';

const REDIS_TOGGLE_KEY = 'redis-enabled';

export const useRedisToggle = () => {
  const [isRedisEnabled, setIsRedisEnabled] = useState(false);

  useEffect(() => {
    // Cargar el estado desde localStorage al montar el componente
    const savedState = localStorage.getItem(REDIS_TOGGLE_KEY);
    if (savedState !== null) {
      setIsRedisEnabled(JSON.parse(savedState));
    }
  }, []);

  const toggleRedis = (enabled: boolean) => {
    setIsRedisEnabled(enabled);
    localStorage.setItem(REDIS_TOGGLE_KEY, JSON.stringify(enabled));
  };

  return {
    isRedisEnabled,
    toggleRedis
  };
};