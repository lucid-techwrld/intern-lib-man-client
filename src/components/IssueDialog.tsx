import { CalendarClock } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { booksApi, loansApi, membersApi } from '../api/library';
import { LOAN_DAYS } from '../constants';
import { useToast } from '../hooks/useToast';
import { IBook, IMember } from '../types';
import { daysFromNow, fmtDate, splitError } from '../utils';
import { ErrorBanner, Field, Modal } from './ui';
import { SearchPicker } from './SearchPicker';

interface Props { open: boolean; preset?: IBook | null; onClose: () => void; onIssued: () => void }

export function IssueDialog({ open, preset, onClose, onIssued }: Props) {
  return <Modal open={open} onClose={onClose} title="Issue a book"><IssueForm preset={preset ?? null} onClose={onClose} onIssued={onIssued} /></Modal>;
}

function IssueForm({ preset, onClose, onIssued }: { preset: IBook | null; onClose: () => void; onIssued: () => void }) {
  const toast = useToast();
  const [member, setMember] = useState<IMember | null>(null);
  const [book, setBook] = useState<IBook | null>(preset);
  const [err, setErr] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!member) er.member_id = 'Pick a member';
    if (!book) er.book_id = 'Pick a book';
    setErr(er); setBanner('');
    if (er.member_id || er.book_id) return;
    setSaving(true);
    try { await loansApi.issue({ book_id: book!.id, member_id: member!.id }); toast(`Issued to ${member!.name}`); onIssued(); onClose(); }
    catch (x) { const s = splitError(x); setErr(s.fields); setBanner(s.banner); } finally { setSaving(false); }
  };

  return (
    <form className="db" onSubmit={submit} noValidate style={{ gridTemplateColumns: '1fr' }}>
      <ErrorBanner message={banner} />
      <Field label="Member" error={err.member_id} group>
        <SearchPicker<IMember> placeholder="Search by name or member ID" value={member} onChange={setMember} getId={(m) => m.id}
          fetcher={(q) => membersApi.list({ q, limit: 6 }).then((r) => r.data)}
          render={(m) => <div><b>{m.name}</b><div className="mt">{m.member_code} · {m.active_loans} book{m.active_loans === 1 ? '' : 's'} out</div></div>} />
      </Field>
      <Field label="Book" error={err.book_id} group>
        <SearchPicker<IBook> placeholder="Search available books" value={book} onChange={setBook} getId={(b) => b.id}
          fetcher={(q) => booksApi.list({ q, available: true, limit: 6 }).then((r) => r.data)}
          render={(b) => <div><b>{b.title}</b><div className="mt">{b.author} · {b.copies_available} in</div></div>} />
      </Field>
      <p className="mt" style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center' }}><CalendarClock size={16} />Due {fmtDate(daysFromNow(LOAN_DAYS).toISOString())} ({LOAN_DAYS} days)</p>
      <div className="foot"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn pop" disabled={saving}>{saving ? 'Issuing…' : 'Issue book'}</button></div>
    </form>
  );
}
