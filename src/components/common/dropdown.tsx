import { Option } from '@/types/common';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const Dropdown = ({
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  placeholder = 'Select an option',
  className = '',
}: {
  value: number | null;
  options: Option[];
  onChange: (value: number) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter and sort options
  const filteredOptions = options
    .filter((option) =>
      option.name?.toLowerCase().includes(search.toLowerCase())
    )
    // Sort to put matching options at the top
    .sort((a, b) => {
      const aMatches = a.name?.toLowerCase().startsWith(search.toLowerCase());
      const bMatches = b.name?.toLowerCase().startsWith(search.toLowerCase());
      return aMatches === bMatches ? 0 : aMatches ? -1 : 1;
    });

  // Get selected option
  const selectedOption = options.find((option) => option.value === value);

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
          <span
            className={selectedOption ? 'text-black truncate' : 'text-gray-500'}
          >
            {selectedOption?.name || placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            } ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div
            className="absolute z-50 mt-2 w-full rounded-lg
            shadow-lg bg-white border border-gray-200
            overflow-hidden animate-dropdown"
          >
            {/* Search Input */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2
                  w-4 h-4 text-gray-400"
                />
                <input
                  type="text"
                  className="w-full pl-9 pr-9 py-2
                  border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <ul
              className="max-h-64 overflow-y-auto text-base divide-y"
              role="listbox"
            >
              {loading ? (
                <li className="px-4 py-2 text-center text-gray-500">
                  Loading options...
                </li>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`
                      px-4 py-2.5 cursor-pointer 
                      transition-colors duration-150 ease-in-out
                      truncate
                      ${
                        option.value === value
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'hover:bg-gray-100'
                      }
                    `}
                    onClick={() => {
                      onChange(option.value as number);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    {option.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-center text-gray-500">
                  No matching options
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
