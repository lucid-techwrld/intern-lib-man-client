import { HUES } from '../utils';

export function WeeklyChart({ data }: { data: { day: string; issued: number; returned: number }[] }) {
  const max = Math.max(3, ...data.flatMap((d) => [d.issued, d.returned]));
  const H = 120;
  return (
    <div>
      <svg viewBox="0 0 460 170" width="100%" role="img" aria-label="Books issued and returned over the last 7 days">
        {[0, 0.5, 1].map((t) => <line key={t} x1="10" x2="450" y1={10 + H * t} y2={10 + H * t} stroke="var(--line)" strokeDasharray="3 4" />)}
        {data.map((d, i) => {
          const x = 24 + i * 62;
          const hi = (d.issued / max) * H, hr = (d.returned / max) * H;
          return (
            <g key={d.day}>
              <rect x={x} y={10 + H - hi} width="18" height={Math.max(hi, 2)} rx="5" fill="var(--brand)" />
              <rect x={x + 21} y={10 + H - hr} width="18" height={Math.max(hr, 2)} rx="5" fill="var(--pop)" />
              <text x={x + 20} y="156" textAnchor="middle" fontSize="12" fill="var(--mute)">{new Date(d.day + 'T00:00').toLocaleDateString(undefined, { weekday: 'short' })}</text>
            </g>
          );
        })}
      </svg>
      <div className="legend"><span><i style={{ background: 'var(--brand)' }} />Issued</span><span><i style={{ background: 'var(--pop)' }} />Returned</span></div>
    </div>
  );
}

export function Donut({ data }: { data: { category: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const r = 54, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div>
      <svg viewBox="0 0 150 150" width="170" height="170" style={{ display: 'block', margin: '0 auto' }} role="img" aria-label="Titles by category">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--line)" strokeWidth="18" />
        {data.map((d, i) => {
          const len = (d.count / total) * c;
          const seg = <circle key={d.category} cx="75" cy="75" r={r} fill="none" stroke={`hsl(${HUES[i % 6]} 55% 45%)`} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} transform="rotate(-90 75 75)" />;
          acc += len;
          return seg;
        })}
        <text x="75" y="76" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--ink)" fontFamily="var(--display)">{total}</text>
        <text x="75" y="94" textAnchor="middle" fontSize="11" fill="var(--mute)">titles</text>
      </svg>
      <div className="legend" style={{ justifyContent: 'center' }}>{data.map((d, i) => <span key={d.category}><i style={{ background: `hsl(${HUES[i % 6]} 55% 45%)` }} />{d.category} {d.count}</span>)}</div>
    </div>
  );
}
