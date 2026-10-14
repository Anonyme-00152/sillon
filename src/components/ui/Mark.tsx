// Monogramme Sillon : un disque traversé de sillons concentriques.
export default function Mark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <circle cx="16" cy="16" r="2.2" fill="var(--accent)" />
    </svg>
  );
}
