import { useState, useRef } from "react";

function IngredientCombobox({ value, onChange, suggestions }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  const filtered = value.length >= 1
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : [];

  function select(name) {
    onChange(name);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleChange(e) {
    onChange(e.target.value);
    setOpen(e.target.value.length > 0);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="combobox-wrapper">
      <input
        ref={inputRef}
        className="combobox-input"
        placeholder="Ingrédient"
        value={value}
        onChange={handleChange}
        onFocus={() => { if (value.length > 0 && filtered.length > 0) setOpen(true); }}
        onBlur={() => setTimeout(() => { setOpen(false); setActiveIndex(-1); }, 150)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && filtered.length > 0 && (
        <ul className="combobox-list" role="listbox">
          {filtered.map((s, i) => (
            <li
              key={s}
              className={`combobox-item ${i === activeIndex ? "active" : ""}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={e => { e.preventDefault(); select(s); }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IngredientCombobox;
