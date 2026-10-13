/** Burlap sack illustration used for 5 kg and 10 kg packs. Swap for a real photo when available. */
export default function Sack({ label }) {
  const stitchRows = [70, 82, 94, 106, 118, 130, 142, 154, 166, 178];
  return (
    <svg viewBox="0 0 170 200" height="190" aria-hidden="true">
      <path d="M58 18 Q85 4 112 18 L108 42 Q150 52 156 100 Q164 160 148 186 Q85 198 22 186 Q6 160 14 100 Q20 52 62 42 Z" fill="#cdb072" stroke="#8f7740" strokeWidth="2" />
      <path d="M62 42 Q85 52 108 42" fill="none" stroke="#8f7740" strokeWidth="3" />
      <path d="M56 40 Q85 30 114 40 M60 50 Q85 40 110 50" fill="none" stroke="#b8923a" strokeWidth="3" strokeLinecap="round" />
      <g opacity=".25" stroke="#6b5420" strokeWidth=".8">
        {stitchRows.map((y) => <path key={y} d={`M18 ${y} H152`} />)}
      </g>
      <rect x="38" y="72" width="94" height="88" rx="8" fill="#fbf5e2" stroke="#b8923a" />
      <text x="85" y="102" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="18" fill="#2f6a3c">NutriRatna</text>
      <text x="85" y="118" textAnchor="middle" fontSize="7" letterSpacing="1.2" fill="#b8923a">RAW MAKHANA</text>
      <text x="85" y="148" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="700" fontSize="26" fill="#1f3d2b">{label}</text>
    </svg>
  );
}
