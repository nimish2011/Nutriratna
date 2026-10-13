/** A label + input wrapper used by all forms. `full` spans both columns; `error` shows a red message. */
export default function Field({ label, full, error, children }) {
  return (
    <div className={full ? 'full' : undefined}>
      <label>{label} <span className="req" aria-hidden="true">*</span></label>
      {children}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
