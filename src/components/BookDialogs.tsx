import { Pencil, Trash2, BookUp } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { booksApi } from '../api/library';
import { CATEGORIES } from '../constants';
import { useToast } from '../hooks/useToast';
import { IBook } from '../types';
import { errMsg, splitError } from '../utils';
import { BookCover } from './BookCover';
import { ErrorBanner, Field, Modal } from './ui';

export function BookFormDialog({ open, book, onClose, onSaved }: { open: boolean; book: IBook | null; onClose: () => void; onSaved: () => void }) {
  return <Modal open={open} onClose={onClose} title={book ? 'Edit book' : 'Add a book'}><BookForm book={book} onClose={onClose} onSaved={onSaved} /></Modal>;
}

function BookForm({ book, onClose, onSaved }: { book: IBook | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ title: book?.title ?? '', author: book?.author ?? '', isbn: book?.isbn ?? '', category: book?.category ?? CATEGORIES[0], copies_total: String(book?.copies_total ?? 1) });
  const [err, setErr] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.title.trim()) er.title = 'Enter a title';
    if (!f.author.trim()) er.author = 'Enter an author';
    if (!f.isbn.trim()) er.isbn = 'Enter an ISBN';
    if (!(Number(f.copies_total) >= 1)) er.copies_total = 'At least 1 copy';
    setErr(er); setBanner('');
    if (Object.keys(er).length) return;
    setSaving(true);
    try {
      const input = { ...f, copies_total: Number(f.copies_total) };
      if (book) await booksApi.update(book.id, input); else await booksApi.create(input);
      toast(book ? 'Changes saved' : 'Book added');
      onSaved(); onClose();
    } catch (x) { const s = splitError(x); setErr(s.fields); setBanner(s.banner); } finally { setSaving(false); }
  };

  return (
    <form className="db" onSubmit={submit} noValidate>
      <ErrorBanner message={banner} />
      <Field label="Title" error={err.title} className="w"><input value={f.title} onChange={set('title')} autoFocus /></Field>
      <Field label="Author" error={err.author}><input value={f.author} onChange={set('author')} /></Field>
      <Field label="ISBN" error={err.isbn}><input value={f.isbn} onChange={set('isbn')} /></Field>
      <Field label="Category"><select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Copies" error={err.copies_total}><input type="number" min={1} value={f.copies_total} onChange={set('copies_total')} /></Field>
      <div className="foot"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save book'}</button></div>
    </form>
  );
}

interface DetailProps { book: IBook | null; onClose: () => void; onEdit: (b: IBook) => void; onIssue: (b: IBook) => void; onDeleted: () => void }

export function BookDetailDialog({ book, onClose, onEdit, onIssue, onDeleted }: DetailProps) {
  return <Modal open={!!book} onClose={onClose} title="Book details" wide>{book && <Detail book={book} onClose={onClose} onEdit={onEdit} onIssue={onIssue} onDeleted={onDeleted} />}</Modal>;
}

function Detail({ book, onClose, onEdit, onIssue, onDeleted }: DetailProps & { book: IBook }) {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [banner, setBanner] = useState('');
  const remove = async () => {
    try { await booksApi.remove(book.id); toast('Book deleted'); onDeleted(); onClose(); } catch (e) { setBanner(errMsg(e)); setConfirming(false); }
  };
  const rows: [string, string][] = [['Author', book.author], ['ISBN', book.isbn], ['Category', book.category]];
  return (
    <div className="db">
      <ErrorBanner message={banner} />
      <div className="detail">
        <BookCover book={book} size="lg" />
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <h3 style={{ fontSize: 24, lineHeight: 1.15 }}>{book.title}</h3>
          <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <p className="mt" style={{ margin: '12px 0 0' }}>{book.copies_available} of {book.copies_total} copies available</p>
          <div className="meter"><i style={{ width: `${(book.copies_available / book.copies_total) * 100}%` }} /></div>
        </div>
      </div>
      <div className="foot">
        {confirming
          ? <><button className="btn ghost" onClick={() => setConfirming(false)}>Keep</button><button className="btn danger" onClick={remove}>Yes, delete</button></>
          : <><button className="btn ghost" onClick={() => setConfirming(true)}><Trash2 size={16} />Delete</button>
              <button className="btn ghost" onClick={() => { onClose(); onEdit(book); }}><Pencil size={16} />Edit</button>
              <button className="btn pop" disabled={book.copies_available < 1} onClick={() => { onClose(); onIssue(book); }}><BookUp size={16} />Issue this book</button></>}
      </div>
    </div>
  );
}
