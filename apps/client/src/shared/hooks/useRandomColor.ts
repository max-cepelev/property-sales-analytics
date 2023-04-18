import { useState } from 'react';

const useRandomColor = () => {
  const [color, setColor] = useState('');
  const generateColor = () => {
    setColor(Math.random().toString(16));
  };
  return { color, generateColor };
};
export default useRandomColor;
