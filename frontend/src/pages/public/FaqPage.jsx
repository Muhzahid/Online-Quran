const faqs = [
  {
    q: 'How do I book a free trial?',
    a: 'Create an account, choose a course and teacher, then select an available time slot on the trial booking page.',
  },
  {
    q: 'Are teachers verified?',
    a: 'Yes. Teachers submit qualifications and must be approved by an admin before conducting classes.',
  },
  {
    q: 'Can I change my teacher later?',
    a: 'Yes. Contact support or manage your bookings from the student dashboard after your trial.',
  },
  {
    q: 'What if I miss a class?',
    a: 'Teachers mark attendance. Depending on your plan, you may reschedule according to availability policies.',
  },
  {
    q: 'Do you offer female teachers for sisters?',
    a: 'Yes. Use teacher filters by gender and specialization to find the right instructor.',
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">FAQ</h1>
      <p className="mt-2 text-text-muted">Answers to common questions.</p>
      <div className="mt-8 space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="border-b border-border pb-4">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <p className="mt-2 text-sm text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
