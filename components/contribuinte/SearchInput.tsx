"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div
      className="ga-search"
      style={{
        width: 360,
        background: "var(--ga-surface)",
        borderColor: "var(--ga-border-strong)",
        height: 40,
      }}
    >
      <Search size={14} color="#8A91A3" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value !== "" && (
        <button
          type="button"
          className="ga-caption"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          style={{ cursor: "pointer", background: "none", border: 0, color: "inherit" }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
