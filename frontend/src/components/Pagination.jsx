export default function Pagination({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => onChange(i + 1)}>
          {i + 1}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}