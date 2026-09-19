export default function Scene({ id, title, caption, children, className = '' }) {
  return <section id={id} className={`section ${className}`} tabIndex={-1} aria-labelledby={`${id}-title`}><div className="container"><div className="section-label"><span>{title}</span><span>{caption}</span></div>{children}</div></section>;
}
export function Tags({ items }) { return <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>; }
export function Certificate() { return <div className="personal-note"><span>EF SET English Certificate</span><span>C1 Advanced</span><a className="certificate-placeholder" href="https://cert.efset.org/ZL3F62" target="_blank" rel="noopener noreferrer">Voir le certificat ↗</a></div>; }
