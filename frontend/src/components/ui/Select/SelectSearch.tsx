import React from 'react';

interface SelectSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const SelectSearch: React.FC<SelectSearchProps> = ({
  searchTerm,
  onSearchChange,
  onKeyDown,
  searchInputRef,
}) => {
  return (
    <div className="p-2 border-b border-border">
      <input
        ref={searchInputRef}
        type="text"
        className="w-full px-3 py-1.5 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default SelectSearch;
