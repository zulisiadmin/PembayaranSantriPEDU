import './ListScreen.css';

export function ListScreen({ title, subtitle, children }) {
  return (
    <div className="screen-content">
      <section className="plain-section">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="stack">{children}</div>
      </section>
    </div>
  );
}
