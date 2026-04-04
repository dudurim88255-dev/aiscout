// q/a 와 question/answer 양쪽 형식 모두 허용
interface FaqItem {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface FaqSectionProps {
  items: FaqItem[];
}

export default function FaqSection({ items = [] }: FaqSectionProps) {
  const normalized = items.map(item => ({
    question: item.question ?? item.q ?? '',
    answer: item.answer ?? item.a ?? '',
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: normalized.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="my-10">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {normalized.map((item, i) => (
            <details
              key={i}
              className="rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <summary
                className="font-medium cursor-pointer list-none flex justify-between items-center gap-4 px-5 py-4"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>{item.question}</span>
                <span className="flex-shrink-0 text-xs" style={{ color: 'var(--accent-amber)' }}>▼</span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: 0 }}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
