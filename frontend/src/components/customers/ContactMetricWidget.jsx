/** Original index#widgets heading/metric slots; unsupported demo slots omitted. */
export default function ContactMetricWidget({ title, value, currency = false }) {
  return (
    <article className="widget-card contact-metric-widget" aria-label={title}>
      <div className="widget-top">
        <div className="widget-heading">
          <div><span className="widget-kicker">{currency ? "Financeiro" : "Contatos"}</span><h3>{title}</h3></div>
        </div>
      </div>
      <div className="widget-metric"><strong className={currency ? "widget-currency" : undefined}>{value}</strong></div>
    </article>
  );
}
