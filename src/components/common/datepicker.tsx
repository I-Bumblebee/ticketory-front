import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronDown } from 'lucide-react';

type StyledDatePickerProps = {
  value?: Date;
  onChange: (newValue: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const StyledDatePicker: React.FC<StyledDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select a date',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="relative">
        {/* Dropdown Trigger */}
        <button
          type="button"
          className={`
            w-full flex items-center justify-between 
            px-4 py-2.5 rounded-lg border 
            transition-all duration-200 ease-in-out
            ${
              disabled
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
            }
            text-left text-base
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={value ? 'text-black truncate' : 'text-gray-500'}>
            {value ? value.toDateString() : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            } ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
          />
        </button>

        {isOpen && !disabled && (
          <div
            className="absolute z-50 mt-2  rounded-lg
            shadow-lg bg-white border border-gray-200
            overflow-hidden"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date || undefined);
                setIsOpen(false);
              }}
              className="p-4 text-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StyledDatePicker;
