import { useState } from 'react';

export default function useSessionStorage<T>(
  keyName: string,
  defaultValue: T,
): [T, (newValue: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.sessionStorage.getItem(keyName);

      if (value) {
        const savedValue: T = JSON.parse(value);
        return savedValue;
      } else {
        window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      window.sessionStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}
