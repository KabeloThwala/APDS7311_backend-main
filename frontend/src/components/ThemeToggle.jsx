import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`group relative flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10 dark:focus:ring-teal-300/50 ${className}`.trim()}
    >
      <span className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200/80 px-1 transition-colors duration-300 ease-out dark:bg-slate-700/70">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-700 shadow transition-transform duration-300 ease-out dark:bg-slate-900 dark:text-amber-200 ${isDark ? 'translate-x-6' : 'translate-x-0'}`.trim()}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 17a7 7 0 009-4.21z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-amber-400">
              <path d="M12 4.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 0112 4.75zM6.22 6.22a.75.75 0 011.06 0l.35.35a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.06zM4.75 12a.75.75 0 01-.75-.75v-.5a.75.75 0 011.5 0v.5A.75.75 0 014.75 12zm7.25 7.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zM18 12a6 6 0 11-6-6 6 6 0 016 6zm-1.5 0a4.5 4.5 0 10-4.5 4.5 4.51 4.51 0 004.5-4.5z" />
            </svg>
          )}
        </span>
      </span>
      <span className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors duration-200 dark:text-slate-300 sm:block">
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  )
}

