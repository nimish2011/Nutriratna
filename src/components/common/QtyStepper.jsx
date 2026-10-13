/** − 1 + control. `max` stops the quantity going above available stock. */
export default function QtyStepper({ value, onChange, min = 1, max = 999 }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease">−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase">+</button>
    </div>
  );
}
