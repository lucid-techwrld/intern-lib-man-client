import { IBook, IBookInput, ILoan, IMember, IMemberInput, IPage, IReport, LoanStatus } from '../types';
import { apiClient } from './client';

const qs = (o: object) => {
  const p = new URLSearchParams();
  Object.entries(o as Record<string, unknown>).forEach(([k, v]) => { if (v !== '' && v !== undefined && v !== null && v !== false) p.set(k, String(v)); });
  return p.toString();
};
const json = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });
const unwrap = async <T>(req: Promise<{ data: T }>) => (await req).data;

export const booksApi = {
  list: (q: { q?: string; category?: string; available?: boolean; page?: number; limit?: number }) => apiClient.request<IPage<IBook>>(`/books?${qs(q)}`),
  create: (i: IBookInput) => unwrap(apiClient.request<{ data: IBook }>('/books', json('POST', i))),
  update: (id: number, i: IBookInput) => unwrap(apiClient.request<{ data: IBook }>(`/books/${id}`, json('PUT', i))),
  remove: (id: number) => apiClient.request<void>(`/books/${id}`, json('DELETE')),
};
export const membersApi = {
  list: (q: { q?: string; page?: number; limit?: number }) => apiClient.request<IPage<IMember>>(`/members?${qs(q)}`),
  create: (i: IMemberInput) => unwrap(apiClient.request<{ data: IMember }>('/members', json('POST', i))),
};
export const loansApi = {
  list: (q: { status: LoanStatus; q?: string; page?: number; limit?: number }) => apiClient.request<IPage<ILoan>>(`/loans?${qs(q)}`),
  issue: (i: { book_id: number; member_id: number }) => unwrap(apiClient.request<{ data: ILoan }>('/loans', json('POST', i))),
  return: (id: number) => unwrap(apiClient.request<{ data: ILoan }>(`/loans/${id}/return`, json('POST'))),
};
export const reportsApi = {
  summary: () => unwrap(apiClient.request<{ data: IReport }>('/reports/summary')),
};
