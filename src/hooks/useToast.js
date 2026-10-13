import { useRef, useState } from 'react';

/** Shows a short message at the bottom of the screen. */
export function useToast() {
  const [message, setMessage] = useState('');
  const timer = useRef();

  const show = (text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), 2600);
  };
  return { message, show };
}
