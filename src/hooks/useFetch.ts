import { useEffect, useState } from 'react';
import { errMsg } from '../utils';

export function useFetch<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true); setError(null);
    fn().then((d) => alive && setData(d)).catch((e) => alive && setError(errMsg(e))).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [...deps, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, loading, error, reload: () => setTick((t) => t + 1) };
}
