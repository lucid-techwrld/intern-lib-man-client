import { BookUp, Search, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { loansApi } from '../api/library';
import { BookCover } from '../components/BookCover';
import { IssueDialog } from '../components/IssueDialog';
import { EmptyState, ErrorBanner, PageHeader, Pagination, Skeletons } from '../components/ui';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { ILoan, LoanStatus } from '../types';
import { errMsg, fmtDate, money } from '../utils';

const TABS: { id: LoanStatus; label: string }[] = [{ id: 'active', label: 'Active' }, { id: 'overdue', label: 'Overdue' }, { id: 'returned', label: 'Returned' }, { id: 'all', label: 'All' }];

function StatusBadge({ l }: { l: ILoan }) {
  if (l.returned_at) return <span className="badge out">Returned {fmtDate(l.returned_at)}{l.fine_due ? ` · ${money(l.fine_due)} fine` : ''}</span>;
  if (l.is_overdue) return <span className="badge late">{l.overdue_days}d overdue · {money(l.fine_due)}</span>;
  return <span className="badge ok">Due {fmtDate(l.due_at)}</span>;
}

export default function Loans() {
  const toast = useToast();
  const [status, setStatus] = useState<LoanStatus>('active');
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [page, setPage] = useState(1);
  const [issueOpen, setIssueOpen] = useState(false);
  const { data, loading, error, reload } = useFetch(() => loansApi.list({ status, q: dq, page, limit: 10 }), [status, dq, page]);
  const loans = data?.data ?? [];

  const giveBack = async (id: number) => {
    try { const l = await loansApi.return(id); toast(l.fine_due ? `Returned. Fine: ${money(l.fine_due)}` : 'Book returned'); reload(); } catch (e) { toast(errMsg(e)); }
  };

  return (
    <div className="page">
      <PageHeader title="Issue & return" sub="Lend books, take them back, and keep an eye on due dates."
        action={<button className="btn pop" onClick={() => setIssueOpen(true)}><BookUp size={18} />Issue book</button>} />
      <div className="toolbar">
        <div className="tabs" role="tablist">{TABS.map((t) => <button key={t.id} role="tab" aria-selected={status === t.id} onClick={() => { setStatus(t.id); setPage(1); }}>{t.label}</button>)}</div>
        <div className="search"><Search size={18} /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search book or member" aria-label="Search loans" /></div>
      </div>
      {error && <ErrorBanner message={error} />}
      <div className="card">
        {loading && !data ? <Skeletons />
          : loans.length === 0 ? <EmptyState title="Nothing here" text={status === 'overdue' ? 'No overdue books. Nice.' : 'No loans match this view.'} />
          : loans.map((l) => (
            <div className="row" key={l.id}>
              <BookCover book={{ id: l.book_id, title: l.book_title, category: '' }} size="sm" />
              <div style={{ minWidth: 0 }}><b>{l.book_title}</b><span className="mt">{l.member_name} · {l.member_code} · issued {fmtDate(l.issued_at)}</span></div>
              <div className="end"><StatusBadge l={l} />{!l.returned_at && <button className="btn sm" onClick={() => giveBack(l.id)}><Undo2 size={14} />Return</button>}</div>
            </div>))}
      </div>
      {data && <Pagination meta={data.meta} onPage={setPage} />}
      <IssueDialog open={issueOpen} onClose={() => setIssueOpen(false)} onIssued={reload} />
    </div>
  );
}
