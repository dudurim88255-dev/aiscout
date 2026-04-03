interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
}

export default function FaqSection({ items }: FaqSectionProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
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
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          자주 묻는 질문
        </h2>
        <div className="space-y-4">
          {items.map((item, i) => (
            <details
              key={i}
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <summary
                className="font-medium cursor-pointer list-none flex justify-between items-center"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.question}
                <span style={{ color: 'var(--accent-amber)' }}>▼</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
