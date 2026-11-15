import { Search, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface Props<T> {
  placeholder: string; value: T | null; onChange: (v: T | null) => void;
  fetcher: (q: string) => Promise<T[]>; getId: (v: T) => number; render: (v: T) => ReactNode;
}

export function SearchPicker<T>({ placeholder, value, onChange, fetcher, getId, render }: Props<T>) {
  const [q, setQ] = useState('');
  const dq = useDebounce(q, 200);
  const [items, setItems] = useState<T[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetcher(dq).then((r) => alive && setItems(r)).catch(() => alive && setItems([]));
    return () => { alive = false; };
  }, [dq, open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (value) {
    return <div className="picked"><div>{render(value)}</div><button type="button" className="icon-btn" onClick={() => onChange(null)} aria-label="Change selection"><X size={16} /></button></div>;
  }
  return (
    <div className="picker">
      <div className="inp"><Search size={16} />
        <input value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} />
      </div>
      {open && (
        <ul className="pick-list" role="listbox">
          {items.length === 0 && <li style={{ color: 'var(--mute)', cursor: 'default' }}>No results</li>}
          {items.map((it) => <li key={getId(it)} role="option" onMouseDown={(e) => { e.preventDefault(); onChange(it); setOpen(false); }}>{render(it)}</li>)}
        </ul>
      )}
    </div>
  );
}
