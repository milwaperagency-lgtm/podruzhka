/** URL к файлам из `public/` с учётом `vite.base` (Telegram Mini App и подпапки). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const clean = path.replace(/^\/+/, '');
  if (base === '/' || base === '') return `/${clean}`;
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}/${clean}`;
}
