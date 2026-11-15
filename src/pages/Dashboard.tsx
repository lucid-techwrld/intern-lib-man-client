import { AlarmClock, BookCopy, BookUp, Coins, Library, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { loansApi, reportsApi } from '../api/library';
import { Donut, WeeklyChart } from '../components/charts';
import { IssueDialog } from '../components/IssueDialog';
import { EmptyState, ErrorBanner, PageHeader } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { errMsg, fmtDate, money } from '../utils';

export default function Dashboard() {
  const toast = useToast();
  const { data: r, error, reload } = useFetch(() => reportsApi.summary(), []);
  const [issueOpen, setIssueOpen] = useState(false);

  const giveBack = async (id: number) => {
    try { const l = await loansApi.return(id); toast(l.fine_due ? `Returned. Fine: ${money(l.fine_due)}` : 'Book returned'); reload(); } catch (e) { toast(errMsg(e)); }
  };
  const topLoans = Math.max(1, ...(r?.popular.map((p) => p.loans) ?? [1]));
  const stats = r ? [
    { icon: Library, label: 'Titles', value: r.titles, sub: `${r.copies_total} copies` },
    { icon: BookCopy, label: 'Copies out', value: r.copies_out, sub: `${r.members} members` },
    { icon: AlarmClock, label: 'Overdue', value: r.overdue_count, warn: r.overdue_count > 0 },
    { icon: Coins, label: 'Fines owed', value: money(r.fines_outstanding), warn: r.fines_outstanding > 0 },
  ] : [];

  return (
    <div className="page">
      <PageHeader title="Good to see you" sub="Here’s what’s happening in the library today."
        action={<button className="btn pop" onClick={() => setIssueOpen(true)}><BookUp size={18} />Issue book</button>} />
      {error && <ErrorBanner message={error} />}
      <div className="stats">
        {stats.map(({ icon: Icon, label, value, sub, warn }) => (
          <div key={label} className={`stat ${warn ? 'warn' : ''}`}><span className="ic"><Icon size={22} /></span><div><b>{value}</b><small>{label}{sub ? ` · ${sub}` : ''}</small></div></div>
        ))}
      </div>
      {r && <>
        <div className="two">
          <div className="card"><h3>Activity this week</h3><div className="cb"><WeeklyChart data={r.weekly} /></div></div>
          <div className="card"><h3>Books by category</h3><div className="cb"><Donut data={r.by_category} /></div></div>
        </div>
        <div className="two eq">
          <div className="card"><h3>Most borrowed</h3><div className="cb">
            {r.popular.length === 0 && <p className="mt">No loans yet.</p>}
            {r.popular.map((p, i) => (
              <div className="rank" key={p.id}><span className="n">{i + 1}</span><div><b>{p.title}</b><div className="mt">{p.author}</div><div className="bar"><i style={{ width: `${(p.loans / topLoans) * 100}%` }} /></div></div><span className="badge ok">{p.loans}</span></div>
            ))}
          </div></div>
          <div className="card"><h3>Overdue now</h3>
            {r.overdue.length === 0 ? <EmptyState title="All caught up" text="Nothing is overdue right now." /> : r.overdue.map((l) => (
              <div className="row" key={l.id} style={{ gridTemplateColumns: '1fr auto' }}>
                <div><b>{l.book_title}</b><span className="mt">{l.member_name} · due {fmtDate(l.due_at)}</span></div>
                <div className="end"><span className="badge late">{l.overdue_days}d · {money(l.fine_due)}</span><button className="btn ghost sm" onClick={() => giveBack(l.id)}><Undo2 size={14} />Return</button></div>
              </div>
            ))}
          </div>
        </div>
      </>}
      <IssueDialog open={issueOpen} onClose={() => setIssueOpen(false)} onIssued={reload} />
    </div>
  );
}
