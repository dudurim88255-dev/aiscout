// Task 8에서 AI Scout용으로 교체 예정인 stub 컴포넌트
interface Props {
  doi?: string;
  journal?: string;
  date?: string;
}

export function PaperMetadata({ doi, journal, date }: Props) {
  if (!doi && !journal) return null;
  return (
    <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
      {journal && <span>{journal}</span>}
      {date && <span className="ml-2">{date}</span>}
    </div>
  );
}
