import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih opsi',
  className = '',
  dropdownClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicked outside (support mouse and mobile touch)
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Scroll into view if near bottom edge of viewport when opened downward
  useEffect(() => {
    if (isOpen && containerRef.current) {
      try {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 320) {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {
        // Fallback for older browsers
      }
    }
  }, [isOpen]);

  const selectedLabel = options.find((opt) => opt === value) || value;
  const hasLongOptions = options.some((opt) => String(opt).length > 6);

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
      {/* Trigger Box */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg font-medium transition-all duration-150 cursor-pointer select-none text-left ${
          isOpen
            ? 'border-[#1E3A8A] ring-2 ring-[#1E3A8A]/15 shadow-xs'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <span className={`truncate ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {value ? selectedLabel : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 ml-1.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu - ALWAYS OPENS DOWNWARD & AUTO-SIZES TO FIT TEXT */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 max-h-[min(360px,60vh)] overflow-y-auto ${
            hasLongOptions ? 'w-full min-w-[220px]' : 'w-full'
          } animate-in fade-in-50 duration-150 ${dropdownClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-[#1E3A8A] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="whitespace-nowrap font-medium">{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
