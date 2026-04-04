interface CriteriaRow {
  name: string;
  values: string[];
}

interface ComparisonTableProps {
  tools: string[];
  criteria: CriteriaRow[];
  recommended?: string;
  reason?: string;
}

export default function ComparisonTable({ tools = [], criteria = [], recommended, reason }: ComparisonTableProps) {
  const recommendedIndex = recommended ? tools.indexOf(recommended) : -1;

  return (
    <div className="my-8 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
      {recommended && (
        <div className="px-4 py-2 text-sm font-medium"
          style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)', borderBottom: '1px solid var(--border)' }}>
          ⭐ 추천: {recommended} — {reason}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
              항목
            </th>
            {tools.map((tool, i) => (
              <th key={tool}
                className="px-4 py-3 text-center font-semibold"
                style={{
                  color: i === recommendedIndex ? 'var(--accent-amber)' : 'var(--text-primary)',
                  borderBottom: '1px solid var(--border)',
                  borderLeft: '1px solid var(--border)',
                  background: i === recommendedIndex ? 'rgba(245, 158, 11, 0.06)' : undefined,
                }}>
                {tool}
                {i === recommendedIndex && <span className="ml-1 text-xs">✓</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((row, rowIdx) => (
            <tr key={row.name}
              style={{ borderTop: rowIdx > 0 ? '1px solid var(--border)' : undefined }}>
              <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                {row.name}
              </td>
              {row.values.map((val, colIdx) => (
                <td key={colIdx}
                  className="px-4 py-3 text-center"
                  style={{
                    color: 'var(--text-primary)',
                    borderLeft: '1px solid var(--border)',
                    background: colIdx === recommendedIndex ? 'rgba(245, 158, 11, 0.04)' : undefined,
                  }}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
