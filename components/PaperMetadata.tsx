interface Props {
  doi?: string;
  journal?: string;
  date?: string;
  authors?: string[];
}

export function PaperMetadata({ doi, journal, date, authors }: Props) {
  if (!doi && !journal && !date) return null;
  return (
    <div style={{ background: '#0d1424', border: '1px solid #1e2a42', borderLeft: '3px solid #7c3aed', borderRadius: 8, padding: '0.875rem 1.25rem', margin: '1.5rem 0', fontSize: '0.875rem', color: '#8b96b0' }}>
      <div className="flex flex-wrap gap-4">
        {journal && (
          <div>
            <span style={{ color: '#c5d8f0', fontWeight: 600 }}>저널</span>
            <span className="ml-2">{journal}</span>
          </div>
        )}
        {date && (
          <div>
            <span style={{ color: '#c5d8f0', fontWeight: 600 }}>발표일</span>
            <span className="ml-2">{date}</span>
          </div>
        )}
        {doi && (
          <div>
            <span style={{ color: '#c5d8f0', fontWeight: 600 }}>DOI</span>
            <a
              href={`https://doi.org/${doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hover:underline"
              style={{ color: '#4fd1c5' }}
            >
              {doi}
            </a>
          </div>
        )}
      </div>
      {authors && authors.length > 0 && (
        <div className="mt-2">
          <span style={{ color: '#c5d8f0', fontWeight: 600 }}>저자</span>
          <span className="ml-2">{authors.join(', ')}</span>
        </div>
      )}
    </div>
  );
}
