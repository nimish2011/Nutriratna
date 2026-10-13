const FEATURES = [
  { icon: '🌾', title: 'Farm direct', text: 'Sourced from Mithila growers' },
  { icon: '💪', title: 'High protein', text: 'Low-fat, gluten-free & vegan' },
  { icon: '📦', title: 'Sealed fresh', text: 'Food-grade, airtight packaging' },
  { icon: '🚚', title: 'Pan-India', text: 'Fast, tracked delivery' },
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="wrap feat">
        {FEATURES.map((f) => (
          <div className="card" key={f.title}>
            <div className="ic">{f.icon}</div>
            <h3>{f.title}</h3>
            <p className="mut">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
