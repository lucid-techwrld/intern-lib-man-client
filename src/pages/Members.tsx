import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { membersApi } from '../api/library';
import { Face } from '../components/Face';
import { MemberFormDialog } from '../components/MemberFormDialog';
import { EmptyState, ErrorBanner, PageHeader, Pagination, Skeletons } from '../components/ui';
import { MAX_LOANS } from '../constants';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { HUES, initials } from '../utils';

export default function Members() {
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const { data, loading, error, reload } = useFetch(() => membersApi.list({ q: dq, page, limit: 12 }), [dq, page]);
  const members = data?.data ?? [];

  return (
    <div className="page">
      <PageHeader title="Members" sub="Everyone who can borrow, and how many books they have out."
        action={<button className="btn" onClick={() => setOpen(true)}><UserPlus size={18} />Add member</button>} />
      <div className="toolbar"><div className="search"><Search size={18} /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, email or member ID" aria-label="Search members" /></div></div>
      {error && <ErrorBanner message={error} />}
      {loading && !data ? <div className="card"><Skeletons n={3} /></div>
        : members.length === 0 ? <div className="card"><EmptyState title="No members found" text="Add the first member to start lending." /></div>
        : <div className="members">{members.map((m) => (
            <div className="mem" key={m.id}>
              <Face seed={m.name} className="av" fallback={initials(m.name)} style={{ background: `hsl(${HUES[m.id % 6]} 55% 40%)` }} />
              <div style={{ minWidth: 0 }}><b>{m.name}</b><div className="mt" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.member_code} · {m.email}</div>
                <div className="pips" aria-label={`${m.active_loans} of ${MAX_LOANS} books out`}>{Array.from({ length: MAX_LOANS }, (_, i) => <i key={i} className={i < m.active_loans ? 'on' : ''} />)}</div></div>
            </div>))}</div>}
      {data && <Pagination meta={data.meta} onPage={setPage} />}
      <MemberFormDialog open={open} onClose={() => setOpen(false)} onSaved={reload} />
    </div>
  );
}
