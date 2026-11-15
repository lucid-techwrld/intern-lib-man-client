import { useId } from 'react';

export function Logo({ size = 38 }: { size?: number }) {
  const gid = 'lg' + useId().replace(/:/g, '');
  return (
    <span className="logo-lockup">
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
        <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0B5A52" /><stop offset="1" stopColor="#14A396" /></linearGradient></defs>
        <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
        <rect x="9" y="9" width="6" height="22" rx="1.6" fill="#fff" />
        <rect x="17" y="12" width="6" height="19" rx="1.6" fill="#fff" opacity=".85" />
        <rect x="25" y="10" width="6" height="21" rx="1.6" fill="#FF7A6E" transform="rotate(14 28 30)" />
      </svg>
      <span className="wm">The Stacks</span>
    </span>
  );
}
