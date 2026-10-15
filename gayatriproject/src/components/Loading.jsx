export default function Loading({ label = 'Processing...' }) {
  return <span className="loading-inline"><span className="spinner" aria-hidden="true" />{label}</span>;
}