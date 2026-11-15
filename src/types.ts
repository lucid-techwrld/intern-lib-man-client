export interface IBook { id: number; isbn: string; title: string; author: string; category: string; copies_total: number; copies_available: number }
export type IBookInput = Pick<IBook, 'isbn' | 'title' | 'author' | 'category' | 'copies_total'>;
export interface IMember { id: number; member_code: string; name: string; email: string; phone: string | null; active_loans: number }
export type IMemberInput = { name: string; email: string; phone: string | null };
export type LoanStatus = 'active' | 'overdue' | 'returned' | 'all';
export interface ILoan {
  id: number; book_id: number; member_id: number; book_title: string; book_author: string; member_name: string; member_code: string;
  issued_at: string; due_at: string; returned_at: string | null; overdue_days: number; fine_due: number; is_overdue: boolean;
}
export interface IMeta { page: number; limit: number; total: number }
export interface IPage<T> { data: T[]; meta: IMeta }
export interface IReport {
  titles: number; copies_total: number; copies_out: number; members: number; overdue_count: number;
  fines_outstanding: number; fines_collected: number;
  by_category: { category: string; count: number }[];
  popular: { id: number; title: string; author: string; loans: number }[];
  weekly: { day: string; issued: number; returned: number }[];
  overdue: ILoan[];
}
