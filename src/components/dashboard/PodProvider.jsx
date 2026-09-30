import { createContext, useContext, useEffect, useState } from 'react';
import { loadLivePod, samplePod } from '../../lib/livePod.js';

const PodContext = createContext(samplePod());

export function PodProvider({ children }) {
  const [pod, setPod] = useState(samplePod);

  useEffect(() => {
    let cancelled = false;
    loadLivePod().then((next) => {
      if (!cancelled) setPod(next.source === 'sample' ? samplePod() : next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <PodContext.Provider value={pod}>{children}</PodContext.Provider>;
}

export function usePod() {
  return useContext(PodContext);
}
