'use client';

import React from 'react';

interface FormSwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function FormSwitch({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
}: FormSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {label ? (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
            {label}
          </label>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 ${
          checked ? 'bg-navy' : 'bg-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
