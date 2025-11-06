export const STATUS_BADGE_VARIANTS = Object.freeze({
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70 dark:bg-amber-500/20 dark:text-amber-100',
  submitted: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/70 dark:bg-sky-500/20 dark:text-sky-100',
  verified: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-500/20 dark:text-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-500/20 dark:text-rose-200'
})

export const STATUS_BADGE_FALLBACK =
  'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200'

export const getStatusBadgeClass = (status) =>
  STATUS_BADGE_VARIANTS[status] || STATUS_BADGE_FALLBACK
