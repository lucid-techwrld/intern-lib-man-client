import { HUES } from '../utils';

interface Props { book: { id: number; title: string; category: string }; size?: 'sm' | 'md' | 'lg' }

export function BookCover({ book, size = 'md' }: Props) {
  const h = HUES[book.id % HUES.length];
  return (
    <div className={`cover ${size}`} style={{ background: `linear-gradient(160deg, hsl(${h} 55% 38%), hsl(${h + 25} 60% 24%))` }}>
      <small>{book.category}</small><b>{book.title}</b>
    </div>
  );
}
