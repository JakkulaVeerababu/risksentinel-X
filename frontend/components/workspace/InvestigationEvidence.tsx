import { readableCode } from "../../lib/transaction-presentation";

type InvestigationEvidenceProps = {
  evidence?: unknown[] | null;
};

function evidenceItem(entry: unknown, index: number) {
  const record = entry && typeof entry === "object" && !Array.isArray(entry)
    ? entry as Record<string, unknown>
    : null;
  const type = record && typeof record.type === "string" ? record.type : null;
  const description = typeof entry === "string"
    ? entry
    : record && typeof record.desc === "string"
      ? record.desc
      : record && typeof record.description === "string"
        ? record.description
        : record && typeof record.message === "string"
          ? record.message
          : "A supporting signal was recorded without a text description.";

  return {
    label: type ? `${readableCode(type)} signal` : `Evidence ${index + 1}`,
    description,
  };
}

export default function InvestigationEvidence({ evidence }: InvestigationEvidenceProps) {
  const items = (evidence || [])
    .map(evidenceItem)
    .filter(item => item.description !== "A supporting signal was recorded without a text description.");
    
  if (!items.length) return null;

  return (
    <section className="investigation-evidence" aria-label="Investigation evidence">
      <header>
        <h3>Investigation evidence</h3>
        <p>Recorded signals supporting the advisory recommendation.</p>
      </header>
      <ul>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <span>{item.label}</span>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
