import { useEffect, useRef } from 'react';

export const useAutoScroll = <T,>(dependencies: T) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [dependencies]);

  return scrollRef;
};
