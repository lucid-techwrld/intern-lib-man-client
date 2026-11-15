import { AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import { IMeta } from '../types';

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={wide ? 'wide' : ''} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="dh"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      {open && children}
    </dialog>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return <div className="ph"><div><h1>{title}</h1><p>{sub}</p></div>{action}</div>;
}

export function Field({ label, error, className, group, children }: { label: string; error?: string; className?: string; group?: boolean; children: ReactNode }) {
  const Tag = group ? 'div' : 'label';
  return <Tag className={`${group ? 'fld ' : ''}${className ?? ''}`}>{label}{children}<span className="err">{error}</span></Tag>;
}

export function ErrorBanner({ message }: { message: string }) {
  return message ? <div className="banner w" role="alert"><AlertTriangle size={18} />{message}</div> : null;
}

export function Skeletons({ n = 4 }: { n?: number }) {
  return <>{Array.from({ length: n }, (_, i) => <div className="skeleton" key={i} />)}</>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <svg viewBox="0 0 160 120" width="160" height="120" aria-hidden="true">
        <ellipse cx="80" cy="108" rx="62" ry="7" fill="var(--soft)" />
        <rect x="22" y="78" width="116" height="24" rx="6" fill="var(--brand)" />
        <rect x="34" y="54" width="92" height="24" rx="6" fill="var(--pop)" />
        <rect x="46" y="30" width="68" height="24" rx="6" fill="var(--panel)" stroke="var(--brand)" strokeWidth="3" />
        <rect x="56" y="38" width="30" height="5" rx="2.5" fill="var(--brand)" /><rect x="56" y="46" width="18" height="4" rx="2" fill="var(--line)" />
        <circle cx="130" cy="34" r="9" fill="var(--hi)" /><circle cx="26" cy="50" r="5" fill="var(--soft)" />
      </svg>
      <h3>{title}</h3><p style={{ margin: 0 }}>{text}</p>{action}
    </div>
  );
}

export function Pagination({ meta, onPage }: { meta: IMeta; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(meta.total / meta.limit));
  if (meta.total === 0) return null;
  const from = (meta.page - 1) * meta.limit + 1;
  return (
    <div className="pager">
      <span>{from}–{Math.min(meta.total, from + meta.limit - 1)} of {meta.total}</span>
      <div>
        <button className="btn ghost sm" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
        <button className="btn ghost sm" disabled={meta.page >= pages} onClick={() => onPage(meta.page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
