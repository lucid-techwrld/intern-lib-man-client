import { ChangeEvent, FormEvent, useState } from 'react';
import { membersApi } from '../api/library';
import { useToast } from '../hooks/useToast';
import { splitError } from '../utils';
import { ErrorBanner, Field, Modal } from './ui';

export function MemberFormDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  return <Modal open={open} onClose={onClose} title="Add a member"><MemberForm onClose={onClose} onSaved={onSaved} /></Modal>;
}

function MemberForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Enter a name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address';
    setErr(er); setBanner('');
    if (Object.keys(er).length) return;
    setSaving(true);
    try { await membersApi.create({ name: f.name, email: f.email, phone: f.phone.trim() || null }); toast('Member added'); onSaved(); onClose(); }
    catch (x) { const s = splitError(x); setErr(s.fields); setBanner(s.banner); } finally { setSaving(false); }
  };

  return (
    <form className="db" onSubmit={submit} noValidate style={{ gridTemplateColumns: '1fr' }}>
      <ErrorBanner message={banner} />
      <Field label="Full name" error={err.name}><input value={f.name} onChange={set('name')} autoFocus /></Field>
      <Field label="Email" error={err.email}><input type="email" value={f.email} onChange={set('email')} /></Field>
      <Field label="Phone (optional)" error={err.phone}><input inputMode="tel" value={f.phone} onChange={set('phone')} /></Field>
      <div className="foot"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Add member'}</button></div>
    </form>
  );
}
