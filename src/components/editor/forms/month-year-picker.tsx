'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MonthYearPickerProps {
  value: string; // Format: "YYYY-MM"
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

export function MonthYearPicker({ value, onChange, label, disabled }: MonthYearPickerProps) {
  const t = useTranslations('editor.monthPicker');
  
  const MONTHS = [
    t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
    t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
    t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) {
      return parseInt(value.split('-')[0]);
    }
    return new Date().getFullYear();
  });

  const currentMonth = value ? parseInt(value.split('-')[1]) - 1 : null;

  const handleMonthSelect = (monthIndex: number) => {
    const month = (monthIndex + 1).toString().padStart(2, '0');
    onChange(`${selectedYear}-${month}`);
    setIsOpen(false);
  };

  const formatDisplay = (val: string) => {
    if (!val) return t('select');
    const [year, month] = val.split('-');
    return `${MONTHS[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formatDisplay(value)}
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker Dropdown */}
          <div className="absolute z-20 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-64">
            {/* Year Selector */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setSelectedYear(selectedYear - 1)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedYear}
              </span>
              <button
                type="button"
                onClick={() => setSelectedYear(selectedYear + 1)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentMonth === index && parseInt(value.split('-')[0]) === selectedYear
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
