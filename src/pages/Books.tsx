import { BookPlus, Check, Search } from 'lucide-react';
import { useState } from 'react';
import { booksApi } from '../api/library';
import { BookCover } from '../components/BookCover';
import { BookDetailDialog, BookFormDialog } from '../components/BookDialogs';
import { IssueDialog } from '../components/IssueDialog';
import { EmptyState, ErrorBanner, PageHeader, Pagination, Skeletons } from '../components/ui';
import { CATEGORIES } from '../constants';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { IBook } from '../types';

export default function Books() {
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(false);
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => booksApi.list({ q: dq, category, available, page, limit: 12 }), [dq, category, available, page]);
  const [detail, setDetail] = useState<IBook | null>(null);
  const [form, setForm] = useState<{ open: boolean; book: IBook | null }>({ open: false, book: null });
  const [issue, setIssue] = useState<{ open: boolean; book: IBook | null }>({ open: false, book: null });

  const books = data?.data ?? [];
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  return (
    <div className="page">
      <PageHeader title="Catalogue" sub="Browse, search and manage every title in the library."
        action={<button className="btn" onClick={() => setForm({ open: true, book: null })}><BookPlus size={18} />Add book</button>} />
      <div className="toolbar">
        <div className="search"><Search size={18} /><input value={q} onChange={(e) => reset(setQ)(e.target.value)} placeholder="Search title, author or ISBN" aria-label="Search books" /></div>
        <button className="chip" aria-pressed={available} onClick={() => reset(setAvailable)(!available)}>{available && <Check size={13} style={{ verticalAlign: -2 }} />} Available only</button>
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        {['', ...CATEGORIES].map((c) => <button key={c} className="chip" aria-pressed={category === c} onClick={() => reset(setCategory)(c)}>{c || 'All'}</button>)}
      </div>
      {error && <ErrorBanner message={error} />}
      {loading && !data ? <div className="card"><Skeletons n={3} /></div>
        : books.length === 0 ? <div className="card"><EmptyState title="No books found" text="Try a different search or clear the filters." /></div>
        : <div className="books">{books.map((b) => (
            <button className="bk" key={b.id} onClick={() => setDetail(b)}>
              <BookCover book={b} />
              <div className="t">{b.title}</div><div className="a">{b.author}</div>
              <div><span className={`badge ${b.copies_available ? 'ok' : 'out'}`}>{b.copies_available ? `${b.copies_available} available` : 'All out'}</span></div>
            </button>))}</div>}
      {data && <Pagination meta={data.meta} onPage={setPage} />}
      <BookDetailDialog book={detail} onClose={() => setDetail(null)} onEdit={(b) => setForm({ open: true, book: b })} onIssue={(b) => setIssue({ open: true, book: b })} onDeleted={reload} />
      <BookFormDialog open={form.open} book={form.book} onClose={() => setForm((f) => ({ ...f, open: false }))} onSaved={reload} />
      <IssueDialog open={issue.open} preset={issue.book} onClose={() => setIssue((s) => ({ ...s, open: false }))} onIssued={reload} />
    </div>
  );
}
