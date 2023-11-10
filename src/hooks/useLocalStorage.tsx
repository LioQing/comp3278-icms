import { useState } from 'react';

const useLocalStorage = <T extends unknown>(
  key: string,
  defaultValue: T,
): [T, (valueOrFn: T | ((val: T) => T)) => void] => {
  const [localStorageValue, setLocalStorageValue] = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  });

  const setLocalStorageStateValue = (valueOrFn: T | ((val: T) => T)) => {
    let newValue;
    if (typeof valueOrFn === 'function') {
      const fn = valueOrFn as (val: T) => T;
      newValue = fn(localStorageValue);
    } else {
      newValue = valueOrFn;
    }
    localStorage.setItem(key, JSON.stringify(newValue));
    setLocalStorageValue(newValue);
  };
  return [localStorageValue, setLocalStorageStateValue];
};

export default useLocalStorage;
