export const HUES = [172, 12, 262, 38, 200, 336];
export const fmtDate = (d: string) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
export const money = (n: number) => '\u20A6' + Math.round(n).toLocaleString();
export const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
export const daysFromNow = (n: number) => new Date(Date.now() + n * 864e5);
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong');
import { ApiError } from './api/client';

export const splitError = (e: unknown): { fields: Record<string, string>; banner: string } =>
  e instanceof ApiError && Object.keys(e.errors).length ? { fields: e.errors, banner: '' } : { fields: {}, banner: errMsg(e) };
